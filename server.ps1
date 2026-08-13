$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

# Set console title and encoding
$Host.UI.RawUI.WindowTitle = "Servidor Local - SOLUCIONES F&M"

# Close any existing listener on this port if script is run again
if ($listener.IsListening) {
    $listener.Stop()
}

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "      SERVIDOR WEB LOCAL INICIADO CORRECTAMENTE" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " Servidor ejecutándose en: http://localhost:$port/dashboard.html" -ForegroundColor Yellow
    Write-Host " Para instalar la App, haga clic en el botón 'Instalar App' en la cabecera" -ForegroundColor White
    Write-Host " Presione Ctrl + C en esta ventana para cerrar el servidor." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Open browser automatically
    Start-Process "http://localhost:$port/dashboard.html"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $url = $request.Url.LocalPath
        if ($url -eq "/" -or $url -eq "") { 
            $url = "/index.html" 
        }
        
        # Decode URL spaces and characters
        $urlDecoded = [System.Web.HttpUtility]::UrlDecode($url)
        $filePath = Join-Path (Get-Location) $urlDecoded
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Determine content type
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css" { "text/css; charset=utf-8" }
                ".js" { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png" { "image/png" }
                ".ico" { "image/x-icon" }
                default { "application/octet-stream" }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            
            # Add CORS headers to be safe
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # File not found
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("Archivo no encontrado: $url")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Error en el servidor: $_" -ForegroundColor Red
} finally {
    $listener.Stop()
    Write-Host "Servidor detenido." -ForegroundColor Red
}
