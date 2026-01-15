# Download official pdf-lib and fontkit UMD builds into assets/
# Run this in a PowerShell with network access: .\scripts\download-assets.ps1

$assetsDir = Join-Path $PSScriptRoot '..\assets' | Resolve-Path
$assetsDir = $assetsDir.Path

$files = @(
    @{url='https://unpkg.com/pdf-lib/dist/pdf-lib.min.js'; out='pdf-lib.min.js'},
    @{url='https://unpkg.com/@pdf-lib/fontkit/dist/fontkit.umd.js'; out='fontkit.umd.js'}
)

foreach($f in $files){
    $outPath = Join-Path $assetsDir $f.out
    Write-Host "Downloading $($f.url) -> $outPath"
    try{
        Invoke-WebRequest -Uri $f.url -OutFile $outPath -UseBasicParsing -ErrorAction Stop
        Write-Host "Saved: $outPath"
    }catch{
        Write-Warning "Failed to download $($f.url): $_"
    }
}

Write-Host "Done. If you plan to use this app fully offline, ensure these files exist in the assets folder and the service worker is updated."