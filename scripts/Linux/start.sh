#!/bin/bash

while true;
do
  node "../../index.js"
  echo "Client closed or crashed with exit code $?... Restarting." >&2
  echo
done
