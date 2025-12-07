@echo off
setlocal enabledelayedexpansion

REM ============================================
REM  Auto deploy: npm install -> build -> git push
REM  Uruchamiaj ten plik w katalogu projektu.
REM ============================================

REM Przejdź do folderu, w którym leży ten plik
cd /d "%~dp0"

echo.
echo === KROK 1: npm install ===
call npm install
if errorlevel 1 (
    echo [BŁĄD] npm install nie powiodło się.
    goto :end
)

echo.
echo === KROK 2: npm run build (test przed deployem) ===
call npm run build
if errorlevel 1 (
    echo [BŁĄD] npm run build nie powiodło się. Sprawdz kod.
    goto :end
)

echo.
echo === KROK 3: Git add / commit / push ===
git add .

REM automatyczna wiadomość commita z datą i godziną
set msg=auto deploy %date% %time%
git commit -m "%msg%"
if errorlevel 1 (
    echo [INFO] Brak zmian do commita albo commit nieudany.
)

echo.
git push
if errorlevel 1 (
    echo [UWAGA] git push zwrócił błąd. Sprawdz remote / uprawnienia.
    goto :end
)

echo.
echo === GOTOWE (git push wykonany) ===

:end
echo.
pause
endlocal
