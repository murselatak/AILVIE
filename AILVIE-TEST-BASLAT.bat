@echo off
chcp 65001 >nul
title AILVIE - Yerel Test Sunucusu
color 0B

echo.
echo  ========================================
echo     AILVIE - Yerel Test Sunucusu
echo  ========================================
echo.

REM Node.js kurulu mu kontrol et
node --version >nul 2>&1
if errorlevel 1 (
    echo  [HATA] Node.js bulunamadi!
    echo.
    echo  Lutfen once Node.js kurun:
    echo  https://nodejs.org  -^>  LTS surumunu indirin
    echo.
    pause
    exit /b
)

echo  [1/3] Node.js bulundu:
node --version
echo.

REM node_modules var mi? Yoksa kur
if not exist "node_modules\" (
    echo  [2/3] Ilk kurulum yapiliyor... Bu biraz surebilir, lutfen bekleyin.
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo  [HATA] Kurulum basarisiz oldu. Internet baglantinizi kontrol edin.
        pause
        exit /b
    )
) else (
    echo  [2/3] Bagimliliklar zaten kurulu, atlaniyor.
)

echo.
echo  [3/3] Sunucu baslatiliyor...
echo.
echo  ========================================
echo   Uygulama acilacak: http://localhost:5173
echo.
echo   * Tarayicida otomatik acilmazsa, yukaridaki
echo     adresi tarayiciniza yapistirin.
echo.
echo   * Durdurmak icin bu pencerede Ctrl+C basin
echo     veya pencereyi kapatin.
echo  ========================================
echo.

REM 4 saniye sonra tarayiciyi ac (sunucu baslarken)
start "" cmd /c "timeout /t 4 >nul && start http://localhost:5173"

REM Vite dev sunucusunu baslat
call npm run dev
