#!/bin/bash

# Update The Bot
echo Updating the bot...
if git pull --all
then
    echo "Successfully updated the bot!"
    echo
else
    echo "Failed to update the bot with exit code $?." >&2
fi

# Update Node Modules
echo Installing required Node Modules...
if npm i
then
    echo "Successfully updated Node Modules!"
    echo
else
    echo "Failed to update the bot with exit code $?." >&2
fi

echo "Finished Updating everything! (Ignore the warnings, they aren't important.)"
echo
echo "Press any key to exit." && read
