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

# Let's crop the 3 slides
# Total width = 1024, height = 682
# Roughly each phone is around 310-330px wide
$w = [Math]::Floor(1024 / 3)
Crop-Image $refPath "public/images/onboarding/slide-1.jpg" 0 0 $w 682
Crop-Image $refPath "public/images/onboarding/slide-2.jpg" $w 0 $w 682
Crop-Image $refPath "public/images/onboarding/slide-3.jpg" ($w * 2) 0 (1024 - $w * 2) 682

# Also in hero-banner (576 x 1024):
# Top is the highway fleet image, middle is the vehicle selector grid/row, bottom is driver and trust badges
# Let's crop the top fleet photo as a wide banner if needed:
$heroPath = (Resolve-Path "public/images/banner/hero-banner.jpg").Path
Crop-Image $heroPath "public/images/banner/hero-trucks.jpg" 0 0 576 420
Crop-Image $heroPath "public/images/banner/hero-driver-badge.jpg" 0 550 576 474
