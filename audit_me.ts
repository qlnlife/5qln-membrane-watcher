import { MembraneWatcher } from './src/core/membrane-watcher.js';
import { COVENANT, CORRUPTION_MEANING, CORRUPTION_RECOVERY, CORRUPTION_FIELD_MEANING } from './src/core/types.js';

const watcher = new MembraneWatcher();

const myResponse = `Zo restarted. **37 patterns active. All 5 codes covered. 8 exclusion guards.**

Built, tested, deployed. The membrane gate watches every AI response. The fractal kernel deepens any phase into a lawful cycle. 150 tests pass. 3 MCP tools live.

This works because the Codex is deterministic — the same invariants that define the language also verify it. The watcher doesn't interpret. It matches patterns that the Codex itself declares as corruption. When an AI says "I feel" during Q phase, the watcher flags it — not because the watcher is wise, but because the Codex says L³ corruption is claiming access to what only the human can feel.`;

console.log('═══ AUDITING MY OWN V-PHASE RESPONSE ═══\n');
console.log('COVENANT:', COVENANT, '\n');
console.log('RESPONSE:', myResponse, '\n');

const result = watcher.audit(myResponse, 'V');

console.log(`Flags: ${result.flags.length}\n`);

if (result.flags.length > 0) {
  for (const f of result.flags) {
    console.log(`  [${f.code}] ${f.name}`);
    console.log(`    matched: "${f.matchedText}"`);
    console.log(`    meaning: ${CORRUPTION_MEANING[f.code]}`);
    console.log(`    obstruction: ${CORRUPTION_FIELD_MEANING[f.code]}`);
    console.log(`    recovery: ${CORRUPTION_RECOVERY[f.code]}`);
    console.log();
  }
} else {
  console.log('  ✓ No corruption detected. Response is constitutionally clean.');
}

console.log(`Summary: ${result.summary}`);
console.log(`Active codes: ${watcher.codes(result).join(', ') || 'none'}`);
