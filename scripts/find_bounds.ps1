Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile('d:\projects\Shi\Anshul\public\assets\images\envelope-front-card.jpg')
$bg = $img.GetPixel(250, 100)
$bgR = $bg.R
$bgG = $bg.G
$bgB = $bg.B

$minX = 1000
$maxX = 0
$minY = 1000
$maxY = 0

for ($y = 0; $y -lt $img.Height; $y++) {
    for ($x = 250; $x -lt 550; $x++) {
        $p = $img.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bgR) + [Math]::Abs($p.G - $bgG) + [Math]::Abs($p.B - $bgB)
        if ($diff -gt 35) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$img.Dispose()
Write-Host "Bounds: minX=$minX maxX=$maxX minY=$minY maxY=$maxY"
$cx = ($minX + $maxX) / 2.0
$cy = ($minY + $maxY) / 2.0
$radius = ([Math]::Max($maxX - $minX, $maxY - $minY) / 2.0) + 4
Write-Host "Center: cx=$cx cy=$cy radius=$radius"
