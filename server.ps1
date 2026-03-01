$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server running on http://localhost:8080"
$root = "c:\Users\Administrator\Downloads\Antigravity"
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $root ($path.TrimStart("/").Replace("/","\"))
    $resp = $ctx.Response
    if (Test-Path $file) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $ct = switch($ext) {
            ".html" {"text/html; charset=utf-8"}
            ".css"  {"text/css; charset=utf-8"}
            ".js"   {"application/javascript; charset=utf-8"}
            ".png"  {"image/png"}
            ".jpg"  {"image/jpeg"}
            ".svg"  {"image/svg+xml"}
            default {"application/octet-stream"}
        }
        $resp.ContentType = $ct
        $resp.ContentLength64 = $bytes.Length
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $resp.StatusCode = 404
    }
    $resp.OutputStream.Close()
}
