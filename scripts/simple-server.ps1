param(
  [int]$Port = 8085,
  [string]$Root = "d:\\app\\refuel-asist"
)
$listener = New-Object System.Net.HttpListener

# Add multiple prefixes so both localhost and 127.0.0.1 (and the machine name) work.
$prefixes = @(
  "http://localhost:$Port/",
  "http://127.0.0.1:$Port/",
  "http://$env:COMPUTERNAME:$Port/"
)
foreach ($p in $prefixes) {
  try {
    $listener.Prefixes.Add($p)
    Write-Output "Listening prefix added: $p"
  } catch {
    Write-Warning "Could not add prefix $p : $($_.Exception.Message)"
  }
}
try {
  $listener.Start()
  Write-Output "Listening on $prefix"
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $path = $req.Url.AbsolutePath.TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }
    $file = Join-Path $Root $path
    if (Test-Path $file) {
      try {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      } catch {
        $context.Response.StatusCode = 500
      } finally {
        $context.Response.OutputStream.Close()
      }
    } else {
      $context.Response.StatusCode = 404
      $context.Response.OutputStream.Close()
    }
  }
} catch {
  Write-Error "HttpListener error: $_"
} finally {
  if ($listener -and $listener.IsListening) { $listener.Stop() }
}
