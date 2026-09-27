Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/images/onboarding/reference-123.jpg").Path)
Write-Host "Width=$($src.Width), Height=$($src.Height)"

# In reference-123.jpg (1024x682), there are 3 phone mockups side by side.
# Let's see roughly where phone 1, phone 2, phone 3 are located.
# Phone 1 is roughly x: 25 to 330
# Phone 2 is roughly x: 350 to 670
# Phone 3 is roughly x: 690 to 1000

function Save-Slice($x, $y, $w, $h, $name) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = $src.Clone($rect, $src.PixelFormat)
    $bmp.Save("public/images/onboarding/$name.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Host "Exported $name ($w x $h)"
}

Save-Slice 15 20 320 642 "slide-phone-1"
Save-Slice 352 20 320 642 "slide-phone-2"
Save-Slice 688 20 320 642 "slide-phone-3"

$src.Dispose()
