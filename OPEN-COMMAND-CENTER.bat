@echo off
REM ============================================================================
REM  SecureVisa x ITSEC - Interactive Command Center
REM  DOUBLE-CLICK THIS FILE to launch the interface FULLSCREEN (kiosk).
REM  Works fully offline. To exit fullscreen: press Alt+F4.
REM  (The ready-to-run app lives in the RUN folder next to this file.)
REM ============================================================================
title SecureVisa x ITSEC Command Center

set "APP=%~dp0RUN\index.html"
set "APPURL=%APP:\=/%"
set "FLAGS=--kiosk --start-fullscreen --allow-file-access-from-files --autoplay-policy=no-user-gesture-required --disable-pinch --overscroll-history-navigation=0 --user-data-dir=%TEMP%\svg-itsec-kiosk"

if not exist "%APP%" (
  echo Could not find RUN\index.html next to this launcher.
  echo Make sure you copied the whole folder ^(including the RUN folder^).
  pause
  goto :eof
)

set "CHROME="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if defined CHROME ( start "" "%CHROME%" %FLAGS% "file:///%APPURL%" & goto :eof )

set "EDGE="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if defined EDGE ( start "" "%EDGE%" %FLAGS% "file:///%APPURL%" & goto :eof )

start "" "file:///%APPURL%"
