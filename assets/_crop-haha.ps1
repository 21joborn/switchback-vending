Add-Type -AssemblyName System.Drawing

$srcPath = 'C:\Users\oborn\.cursor\projects\c-Users-oborn-Projects-switchback-vending\assets\c__Users_oborn_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_HAHA_Vending_MAchines-2a7505cc-c6a2-4996-9ca9-0789b4ae6fcf.png'
$outPath = 'C:\Users\oborn\Projects\switchback-vending\assets\ai-vending-machine.jpg'

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Output "Source: $($src.Width)x$($src.Height)"

# Remove left lounge (~32%). Keep full height and right edge so both
# machines stay fully visible while sitting nearer the frame center.
$cropX = [int]([Math]::Floor($src.Width * 0.32))
$cropY = 0
$cropW = $src.Width - $cropX
$cropH = $src.Height

Write-Output "Crop rect: x=$cropX y=$cropY w=$cropW h=$cropH"
Write-Output "Removed left fraction: $([Math]::Round(100.0 * $cropX / $src.Width, 1))%"

$rect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
$cropped = $src.Clone($rect, $src.PixelFormat)
$src.Dispose()

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, 92L)

$cropped.Save($outPath, $encoder, $encoderParams)
Write-Output "Final crop dimensions: $($cropped.Width)x$($cropped.Height)"
Write-Output "Saved -> $outPath"
$cropped.Dispose()
