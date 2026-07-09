@echo off
REM ============================================================================
REM  SecureVisa x ITSEC - Interactive Command Center
REM  One-click kiosk launcher. Double-click this file to open the interface
REM  FULLSCREEN (no tab bar) in Chrome or Edge, straight from this folder/USB.
REM  To exit kiosk mode: press Alt+F4.
REM ============================================================================
title SecureVisa x ITSEC Command Center

REM Path to index.html sitting next to this launcher, as a file:// URL.
set "APP=%~dp0index.html"
set "APPURL=%APP:\=/%"

set "FLAGS=--kiosk --start-fullscreen --allow-file-access-from-files --autoplay-policy=no-user-gesture-required --disable-pinch --overscroll-history-navigation=0 --user-data-dir=%TEMP%\svg-itsec-kiosk"

REM --- Try Google Chrome -------------------------------------------------------
set "CHROME="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if defined CHROME (
  start "" "%CHROME%" %FLAGS% "file:///%APPURL%"
  goto :eof
)

REM --- Fall back to Microsoft Edge --------------------------------------------
set "EDGE="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if defined EDGE (
  start "" "%EDGE%" %FLAGS% "file:///%APPURL%"
  goto :eof
)

REM --- Last resort: default browser (not fullscreen) --------------------------
start "" "file:///%APPURL%"
