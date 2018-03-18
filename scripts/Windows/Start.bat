@echo off
title AceBot-v3 by Aceheliflyer
cls
:Start
node "../../index.js"
echo Client closed or crashed with exit code %errorlevel%... Restarting.
echo.
goto Start
