Add-Type -AssemblyName System.Drawing
$srcPath = 'C:\Users\oborn\Projects\switchback-vending\assets\logo-mark.png'
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Output "Before: $($src.Width)x$($src.Height)"

# Aggressive bottom trim: star sits well below VENDING baseline
# Keep left/top; cut bottom ~18% and right ~3% of remaining canvas
$cropW = [int]([Math]::Floor($src.Width * 0.97))
$cropH = [int]([Math]::Floor($src.Height * 0.78))
$rect = New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH
$cropped = $src.Clone($rect, $src.PixelFormat)
$src.Dispose()

$tmp = $srcPath + '.tmp.png'
$cropped.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "After: $($cropped.Width)x$($cropped.Height)"
$cropped.Dispose()
Move-Item -Force $tmp $srcPath

$v = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Output "Saved: $($v.Width)x$($v.Height)"
# Quick scan: any red-ish pixels in bottom 15%?
$red = 0
$y0 = [int]($v.Height * 0.85)
for ($y = $y0; $y -lt $v.Height; $y++) {
  for ($x = 0; $x -lt $v.Width; $x++) {
    $c = $v.GetPixel($x, $y)
    if ($c.A -gt 40 -and $c.R -gt 100 -and $c.G -lt 70 -and $c.B -lt 70) { $red++ }
  }
}
Write-Output "Red pixels in bottom 15%: $red"
$v.Dispose()
