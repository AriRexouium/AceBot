@echo off
echo title AceBot by Aceheliflyer (Installer)
:Start
cls
echo.
:: Install Required Packages
echo Installing Required Packages...
cmd /c "npm i"
echo Finished Installing Packages!
:: Create Launcher
echo.
echo Now Generating the Launcher.
:: Launcher Creating Part.
echo @echo off>Start.bat
echo title AceBot-v2 by Aceheliflyer>> Start.bat
echo cls>> Start.bat
echo :Start>> Start.bat
echo node index.js>> Start.bat
echo echo Client closed or crashed... Restarting.>> Start.bat
echo echo.>> Start.bat
echo goto Start>> Start.bat
:: Finished
<nul set /p "=Finished! Press any key to exit. (When you want to launch the bot, use `Start.bat`.)"
pause >nul
del "%~f0"
exit
