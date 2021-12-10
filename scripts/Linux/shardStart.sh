#!/bin/bash

while true;
do
  node "../../sharder.js"
  echo "Client closed or crashed with exit code $?... Restarting." >&2
  echo
done
