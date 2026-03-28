@echo off
title AILVIE - AI Personal Health Assistant
echo.
echo  ========================================
echo   AILVIE - AI Kisisel Saglik Asistani
echo  ========================================
echo.

:: If package.json is here, we're in the right folder
if exist package.json (
    echo [OK] package.json bulundu.
    goto :INSTALL
)

:: If there's a subfolder with package.json, go there
if exist AILVIE-main\package.json (
    echo [!] Alt klasore giriliyor: AILVIE-main
    cd AILVIE-main
    goto :INSTALL
)

echo [HATA] package.json bulunamadi!
pause
exit /b 1

:INSTALL
echo.
echo [1/2] Bagimliliklar yukleniyor (npm install)...
call npm install
if errorlevel 1 (
    echo [HATA] npm install basarisiz!
    pause
    exit /b 1
)

echo.
echo [2/2] Uygulama baslatiliyor...
echo.
echo  ==========================================
echo   Tarayicida ac: http://localhost:5173
echo   Kapatmak icin bu pencereyi kapat
echo  ==========================================
echo.
call npm run dev

pause
