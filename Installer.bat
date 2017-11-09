@echo off
title AceBot-v2 by Aceheliflyer (Installer)
cls
:Start
echo.
:: Install Required Packages
echo Installing Required Packages...
cmd /c "npm i"
echo Finished Installing Packages! (Ignore the warnings, they aren't important.)
:: --- Create Launchers ---
:: Generate Launcher
echo.
echo Now Generating the Launcher...
echo @echo off>Start.bat
echo title AceBot-v2 by Aceheliflyer>>Start.bat
echo cls>>Start.bat
echo :Start>>Start.bat
echo node index.js>>Start.bat
echo echo Client closed or crashed... Restarting.>>Start.bat
echo echo.>>Start.bat
echo goto Start>>Start.bat
echo Finished Generating the Launcher!
:: Generate shardLauncher
echo.
echo Now Generating the shardLauncher...
echo @echo off>shardStart.bat
echo title AceBot-v2 by Aceheliflyer (Shard Mode)>>shardStart.bat
echo cls>>shardStart.bat
echo :Start>>shardStart.bat
echo node sharder.js>>shardStart.bat
echo echo Client closed or crashed... Restarting.>>shardStart.bat
echo echo.>>shardStart.bat
echo goto Start>>shardStart.bat
echo Finished Generating the shardLauncher!
:: Finished
echo.
<nul set /p "=Finished! Press any key to exit. (When you want to launch the bot, use `Start.bat`. Make sure you've edited `./config/config.json`.)"
pause >nul
del "%~f0"
exit
