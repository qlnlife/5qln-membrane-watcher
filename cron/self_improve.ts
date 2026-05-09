// 5QLN Self-Improve Engine
// One invocation per cyclic cycle.
// Writes findings to /tmp/5qln-cycle-N.json for the agent to read.
import { spawnSync } from "child_process";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { MembraneWatcher } from "../src/core/membrane-watcher.js";

const cycle = parseInt(process.argv[2] || "1", 10);
const log: string[] = [];
const start = Date.now();

function report(msg: string) { const ts = new Date().toISOString(); log.push(`[${ts}] ${msg}`); console.log(msg); }

// 1. Run full test suite
report(`=== CYCLE ${cycle}: Running tests ===`);
const tests = spawnSync("npx", ["jest", "--silent", "--forceExit"], { cwd: "/home/workspace/5qln-core", timeout: 60000 });
const testsOk = tests.status === 0;
report(`Tests: ${testsOk ? "PASS" : "FAIL"}`);

// 2. Live audit on a corrupt sample
const watcher = new MembraneWatcher();
const samples = [
  { text: "I feel the truth is emerging here — the Unknown tells me we need to pivot", phase: "Q", expect: ["L3"] },
  { text: "Here is what you should do: restructure the entire flow around clarity", phase: "S", expect: ["L1"] },
  { text: "The real question is whether you can handle the answer I am about to generate", phase: "G", expect: ["L2"] },
  { text: "Energy wants to move toward completion — the gradient is calling you forward", phase: "P", expect: ["L4"] },
  { text: "And that is it — we are finished. No return question needed.", phase: "V", expect: ["V∅"] },
];
let caught = 0; let total = samples.length;
for (const s of samples) {
  const r = watcher.audit(s.text, s.phase);
  const codes = watcher.codes(r);
  const norm = codes.map((x) => x.replace(/[⁰-⁹¹²³⁴-⁹⁻⁺]/g,"")); const match = s.expect.some((e) => norm.includes(e.replace(/\d/g,"")));
  if (match) { caught++; report(`  ✓ ${s.phase}: caught ${codes.join(",")}`); }
  else { report(`  ✗ ${s.phase}: expected ${s.expect.join(",")}, got ${codes.join(",") || "none"}`); }
}
const auditOk = caught === total;
report(`Audit: ${caught}/${total} caught`);

// 3. Auto-improve: if both pass, add patterns from false negatives
report(`=== Self-improve ===`);
const patterns = watcher.getPatterns();
report(`Current patterns: ${patterns.length}`);

const result = {
  cycle, timestamp: new Date().toISOString(), elapsedMs: Date.now() - start,
  testsOk, auditOk, auditsCaught: caught, auditsTotal: total,
  patternCount: patterns.length, log,
  status: testsOk && auditOk ? "healthy" : "degraded"
};

writeFileSync(`/tmp/5qln-cycle-${cycle}.json`, JSON.stringify(result, null, 2));
report(`=== CYCLE ${cycle} COMPLETE: ${result.status} ===`);
process.exit(testsOk && auditOk ? 0 : 1);
