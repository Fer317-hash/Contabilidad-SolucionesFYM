@echo off
chcp 65001 > nul
title Servidor Local - SOLUCIONES F&M

echo ========================================================
echo          INICIADOR Y CONFIGURADOR DE APLICATIVO
echo                   SOLUCIONES F&M
echo ========================================================
echo.
echo Este asistente abrira el servidor local en su PC.
echo Al ejecutarse en http://localhost:8080, se habilitaran
echo las opciones de instalacion (PWA) de forma segura.
echo.
echo [*] Instrucciones:
echo 1. Presione cualquier tecla para iniciar el servidor.
echo 2. Se abrira el navegador web automaticamente.
echo 3. Haga clic en el boton naranja "Instalar App" en la 
echo    parte superior derecha para guardarlo en su escritorio.
echo.
echo ========================================================
pause
cls

:: Check if server.ps1 exists
if not exist "%~dp0server.ps1" (
    echo [ERROR] No se encontro el archivo server.ps1 en este directorio.
    echo Asegurese de extraer todos los archivos en la misma carpeta.
    pause
    exit
)

:: Run PowerShell script with bypass execution policy
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
