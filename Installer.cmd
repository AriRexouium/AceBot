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
echo @echo off > Start.cmd
echo title AceBot by Aceheliflyer>> Start.cmd
echo :Start>> Start.cmd
echo cls>> Start.cmd
echo node app.js>> Start.cmd
echo ^<nul set /p "=Bot closed or crashed. Press any key to restart.">> Start.cmd
echo pause ^>nul>> Start.cmd
echo goto Start>> Start.cmd
:: Finished
<nul set /p "=Finished! Press any key to exit. (When you want to launch the bot, use `Run.bat`.)"
pause >nul
del "%~f0"
exit
