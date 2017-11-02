@echo off
title AceBot-v2 by Aceheliflyer (Installer)
cls
:Start
echo.
:: Install Required Packages
echo Installing Required Packages...
cmd /c "npm i"
echo Finished Installing Packages! (Ignore the warnings, they aren't important.)
:: Create Launcher
echo.
echo Now Generating the Launcher...
:: Launcher Creating Part.
echo @echo off>Start.bat
echo title AceBot-v2 by Aceheliflyer>> Start.bat
echo cls>> Start.bat
echo :Start>> Start.bat
echo node index.js>> Start.bat
echo echo Client closed or crashed... Restarting.>> Start.bat
echo echo.>> Start.bat
echo goto Start>> Start.bat
echo Finished Generating the Launcher!
echo.
:: Finished
<nul set /p "=Finished! Press any key to exit. (When you want to launch the bot, use `Start.bat`. Make sure you've edited `./config/config.json`.)"
pause >nul
del "%~f0"
exit
