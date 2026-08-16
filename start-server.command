#!/bin/zsh

SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR" || exit 1

if ! command -v node >/dev/null 2>&1; then
    echo "Node.js was not found. Install Node.js, then run this file again."
    echo
    read -r "?Press Return to close this window..."
    exit 1
fi

export HOST=0.0.0.0
export PORT="${PORT:-4173}"

echo "Starting the DLCE Wiki preview server..."
node scripts/dev-server.mjs
EXIT_CODE=$?

echo
echo "The preview server stopped with exit code $EXIT_CODE."
read -r "?Press Return to close this window..."
exit "$EXIT_CODE"
