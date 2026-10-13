Add-Type -AssemblyName System.Drawing

$wreathPath = "d:\projects\Shi\Anshul\public\assets\images\floral-wreath.jpg"
$cardPath = "d:\projects\Shi\Anshul\public\assets\images\envelope-front-card.jpg"
$destPath = "d:\projects\Shi\Anshul\public\assets\images\av-crest-seal.png"

$wreath = New-Object System.Drawing.Bitmap($wreathPath)
$card = New-Object System.Drawing.Bitmap($cardPath)

$size = 512
$dest = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Draw the HD 1024x1024 wreath scaled into 512x512
$destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
$srcRect = New-Object System.Drawing.Rectangle(0, 0, $wreath.Width, $wreath.Height)
$g.DrawImage($wreath, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Now draw the elegant 'A & V' calligraphy from cardPath in the center:
# In cardPath, 'A & V' is located at x: 330..470, y: 110..180
$textSrcRect = New-Object System.Drawing.Rectangle(340, 115, 120, 65)
# Place in the center of 512x512 dest
$textDstW = 200
$textDstH = 108
$textDstRect = New-Object System.Drawing.Rectangle([int](($size - $textDstW) / 2), [int](($size - $textDstH) / 2 + 10), $textDstW, $textDstH)
$g.DrawImage($card, $textDstRect, $textSrcRect, [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()

# Now apply circular transparency mask (radius = 250px)
$finalBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cx = $size / 2.0
$cy = $size / 2.0
$r = 246.0

for ($y = 0; $y -lt $size; $y++) {
    for ($x = 0; $x -lt $size; $x++) {
        $dx = $x - $cx
        $dy = $y - $cy
        $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
        
        if ($dist -gt $r) {
            $finalBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($dist -gt ($r - 3.0)) {
            $alpha = [int](255 * (($r - $dist) / 3.0))
            if ($alpha -lt 0) { $alpha = 0 }
            if ($alpha -gt 255) { $alpha = 255 }
            $p = $dest.GetPixel($x, $y)
            $finalBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        } else {
            $p = $dest.GetPixel($x, $y)
            $finalBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
        }
    }
}

$finalBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$wreath.Dispose()
$card.Dispose()
$dest.Dispose()
$finalBmp.Dispose()

Write-Host "Success! Created HD 512x512 circular crest PNG at $destPath"
