Add-Type -AssemblyName System.Drawing

$srcPath = "d:\projects\Shi\Anshul\public\assets\images\envelope-front-card.jpg"
$destPath = "d:\projects\Shi\Anshul\public\assets\images\av-crest-seal.png"

$src = New-Object System.Drawing.Bitmap($srcPath)
$srcW = [int]$src.Width   # 800
$srcH = [int]$src.Height  # 229

# Exact dead-center of the circular floral wreath crest
$cx = 388.0
$cy = 145.0
$radius = 71.5
$size = [int]($radius * 2.0)

$dest = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $size; $y++) {
    for ($x = 0; $x -lt $size; $x++) {
        $srcX = [int]($cx - $radius + $x)
        $srcY = [int]($cy - $radius + $y)
        
        $dx = $x - $radius
        $dy = $y - $radius
        $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
        
        if ($dist -gt $radius -or $srcX -lt 0 -or $srcX -ge $srcW -or $srcY -lt 0 -or $srcY -ge $srcH) {
            $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($dist -gt ($radius - 2.5)) {
            $alpha = [int](255 * (($radius - $dist) / 2.5))
            if ($alpha -lt 0) { $alpha = 0 }
            if ($alpha -gt 255) { $alpha = 255 }
            $p = $src.GetPixel($srcX, $srcY)
            $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        } else {
            $p = $src.GetPixel($srcX, $srcY)
            $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
        }
    }
}

$dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$dest.Dispose()

Write-Host "Success! Created dead-centered circular crest PNG ($size x $size)"
