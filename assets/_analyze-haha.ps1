Add-Type -AssemblyName System.Drawing

$srcPath = 'C:\Users\oborn\.cursor\projects\c-Users-oborn-Projects-switchback-vending\assets\c__Users_oborn_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_HAHA_Vending_MAchines-2a7505cc-c6a2-4996-9ca9-0789b4ae6fcf.png'
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# Sample mid-height row: dark machine frames vs light wall/lounge
$y = [int]($src.Height * 0.45)
$darkCols = New-Object System.Collections.Generic.List[int]
for ($x = 0; $x -lt $src.Width; $x++) {
  $c = $src.GetPixel($x, $y)
  $luma = (0.299*$c.R + 0.587*$c.G + 0.114*$c.B)
  if ($luma -lt 55) { $darkCols.Add($x) | Out-Null }
}

if ($darkCols.Count -eq 0) {
  Write-Output "No dark columns found"
  $src.Dispose()
  exit 1
}

$first = $darkCols[0]
$last = $darkCols[$darkCols.Count - 1]
Write-Output "Sample y=$y"
Write-Output "First dark x=$first ($([Math]::Round(100.0*$first/$src.Width,1))%)"
Write-Output "Last dark x=$last ($([Math]::Round(100.0*$last/$src.Width,1))%)"
Write-Output "Machine span center x=$([Math]::Round(($first+$last)/2.0))"

# Ideal crop keeping right edge: left margin = right margin
$rightMargin = $src.Width - 1 - $last
$idealCropX = [Math]::Max(0, $first - $rightMargin)
Write-Output "Right margin px=$rightMargin"
Write-Output "Ideal cropX for centering=$idealCropX (remove $([Math]::Round(100.0*$idealCropX/$src.Width,1))%)"
Write-Output "Result size would be $($src.Width - $idealCropX)x$($src.Height)"

$src.Dispose()
