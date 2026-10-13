Add-Type -AssemblyName System.Drawing

$srcPath = "d:\projects\Shi\Anshul\public\assets\images\envelope-front-card.jpg"
$destPath = "d:\projects\Shi\Anshul\public\assets\images\envelope-front-full.jpg"

$src = New-Object System.Drawing.Bitmap($srcPath)
$srcW = [int]$src.Width
$srcH = [int]$src.Height

# Create 800 x 480 envelope (classic 1.66:1 aspect ratio)
$w = 800
$h = 480

$dest = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Sample parchment background
$bgColor = $src.GetPixel(300, 100)
$brush = New-Object System.Drawing.SolidBrush($bgColor)
$g.FillRectangle($brush, 0, 0, $w, $h)
$brush.Dispose()

# 1. Top-Left corner florals: x=0..200, y=0..200
$srcTL = New-Object System.Drawing.Rectangle(0, 0, 200, 200)
$dstTL = New-Object System.Drawing.Rectangle(0, 0, 200, 200)
$g.DrawImage($src, $dstTL, $srcTL, [System.Drawing.GraphicsUnit]::Pixel)

# 2. Top-Right corner florals: x=(srcW-200)..srcW, y=0..200
$srcTR = New-Object System.Drawing.Rectangle([int]($srcW - 200), 0, 200, 200)
$dstTR = New-Object System.Drawing.Rectangle([int]($w - 200), 0, 200, 200)
$g.DrawImage($src, $dstTR, $srcTR, [System.Drawing.GraphicsUnit]::Pixel)

# 3. Center A&V Crest: x=(srcW-230)/2, y=8..220 -> placed at center of dest: (w-230)/2, (h-212)/2
$crestW = 230
$crestH = 212
$srcCrest = New-Object System.Drawing.Rectangle([int](($srcW - $crestW) / 2), 8, $crestW, $crestH)
$dstCrest = New-Object System.Drawing.Rectangle([int](($w - $crestW) / 2), [int](($h - $crestH) / 2), $crestW, $crestH)
$g.DrawImage($src, $dstCrest, $srcCrest, [System.Drawing.GraphicsUnit]::Pixel)

# 4. Double Gold Border around envelope
$goldOuter = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(197, 160, 89), 2.0)
$goldInner = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(212, 175, 55), 1.0)

$g.DrawRectangle($goldOuter, 14, 14, [int]($w - 28), [int]($h - 28))
$g.DrawRectangle($goldInner, 19, 19, [int]($w - 38), [int]($h - 38))

$goldOuter.Dispose()
$goldInner.Dispose()
$g.Dispose()

$dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$src.Dispose()
$dest.Dispose()

Write-Host "Success! Created envelope-front-full.jpg ($w x $h)"
