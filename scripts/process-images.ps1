Add-Type -AssemblyName System.Drawing

function Crop-Image($sourcePath, $destPath, $x, $y, $width, $height) {
    $src = [System.Drawing.Bitmap]::FromFile($sourcePath)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $width, $height)
    $bmp = $src.Clone($rect, $src.PixelFormat)
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    $src.Dispose()
    Write-Host "Saved $destPath ($width x $height)"
}

$refPath = (Resolve-Path "public/images/onboarding/reference-123.jpg").Path
$ref = [System.Drawing.Bitmap]::FromFile($refPath)
Write-Host "reference-123 dimensions: $($ref.Width) x $($ref.Height)"
$ref.Dispose()

$heroPath = (Resolve-Path "public/images/banner/hero-banner.jpg").Path
$hero = [System.Drawing.Bitmap]::FromFile($heroPath)
Write-Host "hero-banner dimensions: $($hero.Width) x $($hero.Height)"
$hero.Dispose()
