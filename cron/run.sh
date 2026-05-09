#!/usr/bin/env bash
set -euo pipefail
STATEDIR="/home/workspace/5qln-watcher-mcp/cron/state"
mkdir -p "$STATEDIR"

CYCLE=${1:-1}
echo "=== 5QLN Self-Improve Cycle ${CYCLE} ==="

cd /home/workspace/5qln-watcher-mcp
npx tsx cron/self_improve.ts "$CYCLE" 2>&1 | tee "/tmp/5qln-cycle-${CYCLE}.log"

echo "Cycle ${CYCLE} complete. State written to /tmp/5qln-cycle-${CYCLE}.json"
