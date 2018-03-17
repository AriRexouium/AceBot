@echo off
title AceBot-v3 by Aceheliflyer (Updater)
cls

:Start
:: Update The Bot
echo.
echo Updating the bot...
cmd /c "git pull --all"
IF /i "%errorlevel%" neq "0" (
  <nul set /p "=Failed to update the bot with exit code %errorlevel%.)"
  pause >nul
  exit
) else (
  echo Successfully updated the bot!
)

:: Install Required Packages
echo.
echo Installing required Node Modules...
cmd /c "npm i"
if /i "%errorlevel%" neq "0" (
  <nul set /p "=Failed to update Node Modules with exit code %errorlevel%."
  pause >nul
  exit
) else (
  echo Successfully updated Node Modules!
)

:: Finished
echo Finished Updating everything! (Ignore the warnings, they aren't important.)
echo.
<nul set /p "=Press any key to exit."
pause >nul
exit
