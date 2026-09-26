Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/images/banner/hero-banner.jpg").Path)
Write-Host "Hero Width=$($src.Width), Height=$($src.Height)"

# In hero-banner.jpg (576 x 1024):
# Let's crop individual vehicles from the middle row
# Total width is 576. 5 vehicles are arranged horizontally with slight margins.
# Roughly each card is ~95-105px wide, between y: 380 and 490
New-Item -ItemType Directory -Force -Path "public/images/vehicles"

function Crop-Veh($x, $y, $w, $h, $name) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = $src.Clone($rect, $src.PixelFormat)
    $bmp.Save("public/images/vehicles/$name.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Host "Exported vehicle: $name ($w x $h)"
}

# 5 vehicles across ~540px width (x ~18 to 558)
# Step size roughly 108px
Crop-Veh 18 375 105 115 "pickup"
Crop-Veh 125 375 105 115 "box"
Crop-Veh 233 375 105 115 "cage"
Crop-Veh 342 375 105 115 "jumbo"
Crop-Veh 450 375 108 115 "six-wheel"

# Also driver portrait at bottom right/center
$rectDriver = New-Object System.Drawing.Rectangle(0, 640, 576, 384)
$bmpDriver = $src.Clone($rectDriver, $src.PixelFormat)
$bmpDriver.Save("public/images/banner/driver-showcase.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmpDriver.Dispose()
Write-Host "Exported driver-showcase"

$src.Dispose()
