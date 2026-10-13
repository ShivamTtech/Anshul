Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\my-pc\.gemini\antigravity-ide\brain\ef164c06-c0d2-4a3f-ae2b-3e50faba6377\as_wax_seal_1791872551554.jpg"
$destPath = "d:\projects\Shi\Anshul\public\assets\images\as-wax-seal.png"

$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $srcBmp.Width
$h = $srcBmp.Height
Write-Host "Source Dimensions: $w x $h"

# Create a 32-bit ARGB bitmap
$outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$cx = $w / 2.0
$cy = $h / 2.0
# The seal circle radius is approx 47.5% - 48.5% of width
$maxR = [Math]::Min($w, $h) * 0.485

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $dx = $x - $cx
        $dy = $y - $cy
        $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
        
        $p = $srcBmp.GetPixel($x, $y)
        $r = $p.R
        $g = $p.G
        $b = $p.B
        
        # Check if checkerboard background (neutral gray / white, near zero color saturation)
        $maxDiff = [Math]::Max([Math]::Abs($r - $g), [Math]::Max([Math]::Abs($r - $b), [Math]::Abs($g - $b)))
        $isNeutral = ($maxDiff -lt 18) -and ($r -gt 150)
        
        if ($dist -gt $maxR -or $isNeutral) {
            # Outside or checkerboard -> transparent
            $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Feather edge if within 3 pixels of boundary
            if ($dist -gt ($maxR - 4)) {
                $alpha = [int](255 * (($maxR - $dist) / 4.0))
                if ($alpha -lt 0) { $alpha = 0 }
                if ($alpha -gt 255) { $alpha = 255 }
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
            } else {
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
            }
        }
    }
}

$outBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$srcBmp.Dispose()
$outBmp.Dispose()

Write-Host "Saved transparent PNG to $destPath"
