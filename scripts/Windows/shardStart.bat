@echo off
title AceBot-v3 by Aceheliflyer (Shard Mode)
cls
:Start
node "../../sharder.js"
echo Client closed or crashed with exit code %ERRORLEVEL%... Restarting.
echo.
goto Start
