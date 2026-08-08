Add-Type -AssemblyName System.Drawing

$src = 'C:\Users\oborn\.cursor\projects\c-Users-oborn-Projects-switchback-vending\assets\c__Users_oborn_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Switchback_Vending_Txt_Logo-190ae5ff-735e-4241-8fbb-ccae3ee2bc9f.png'
$dest = 'C:\Users\oborn\Projects\switchback-vending\assets\logo-text.png'

$orig = [System.Drawing.Bitmap]::FromFile($src)
Write-Output "Original: $($orig.Width)x$($orig.Height)"

$bmp = New-Object System.Drawing.Bitmap $orig.Width, $orig.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gfx = [System.Drawing.Graphics]::FromImage($bmp)
$gfx.DrawImage($orig, 0, 0, $orig.Width, $orig.Height)
$gfx.Dispose()
$orig.Dispose()

for ($y = 0; $y -lt $bmp.Height; $y++) {
  for ($x = 0; $x -lt $bmp.Width; $x++) {
    $c = $bmp.GetPixel($x, $y)
    $max = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
    $min = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
    $chroma = $max - $min
    if ($c.R -ge 190 -and $c.G -ge 190 -and $c.B -ge 190 -and $chroma -lt 45) {
      $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
    }
  }
}

$scanH = [int]($bmp.Height * 0.86)
$minX = $bmp.Width; $minY = $bmp.Height; $maxX = 0; $maxY = 0
for ($y = 0; $y -lt $scanH; $y++) {
  for ($x = 0; $x -lt $bmp.Width; $x++) {
    $c = $bmp.GetPixel($x, $y)
    if ($c.A -gt 40 -and (($c.R + $c.G + $c.B) -lt 540)) {
      if ($x -lt $minX) { $minX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}
Write-Output "Text bbox: ($minX,$minY)-($maxX,$maxY)"

$pad = 20
$x0 = [Math]::Max(0, $minX - $pad)
$y0 = [Math]::Max(0, $minY - $pad)
$x1 = [Math]::Min($bmp.Width - 1, $maxX + $pad)
$y1 = [Math]::Min($scanH - 1, $maxY + $pad)
$w = $x1 - $x0 + 1
$h = $y1 - $y0 + 1
$rect = New-Object System.Drawing.Rectangle $x0, $y0, $w, $h
$cropped = $bmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmp.Dispose()

$tmp = $dest + '.tmp'
$cropped.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Final: $($cropped.Width)x$($cropped.Height)"
$cropped.Dispose()
Move-Item -Force $tmp $dest

$v = [System.Drawing.Bitmap]::FromFile($dest)
$c = $v.GetPixel(2, 2)
$redBottom = 0
for ($y = [Math]::Max(0, $v.Height - 12); $y -lt $v.Height; $y++) {
  for ($x = 0; $x -lt $v.Width; $x++) {
    $p = $v.GetPixel($x, $y)
    if ($p.A -gt 50 -and $p.R -gt 90 -and $p.G -lt 80 -and $p.B -lt 80) { $redBottom++ }
  }
}
Write-Output "Saved $($v.Width)x$($v.Height) cornerA=$($c.A) redInBottom12=$redBottom"
$v.Dispose()
