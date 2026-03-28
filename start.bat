@echo off
title AILVIE - AI Personal Health Assistant
echo.
echo  ========================================
echo   AILVIE - Baslatiliyor...
echo  ========================================
echo.

:: Search for package.json up to 3 levels deep
if exist package.json goto :FOUND
if exist AILVIE-main\package.json (cd AILVIE-main && goto :FOUND)
if exist AILVIE-main\AILVIE-main\package.json (cd AILVIE-main\AILVIE-main && goto :FOUND)
if exist AILVIE\package.json (cd AILVIE && goto :FOUND)
if exist AILVIE\AILVIE\package.json (cd AILVIE\AILVIE && goto :FOUND)

:: Search any subfolder
for /d %%i in (*) do (
    if exist "%%i\package.json" (cd "%%i" && goto :FOUND)
    for /d %%j in ("%%i\*") do (
        if exist "%%j\package.json" (cd "%%j" && goto :FOUND)
    )
)

echo [HATA] package.json bulunamadi!
echo Bu dosyayi AILVIE klasorunun icine koyun.
pause
exit /b 1

:FOUND
echo [OK] Klasor: %CD%
echo.
echo [1/2] npm install...
call npm install --silent
echo.
echo [2/2] Uygulama baslatiliyor...
echo.
echo  ==========================================
echo   Tarayicida ac: http://localhost:5173
echo  ==========================================
echo.
call npm run dev
pause
