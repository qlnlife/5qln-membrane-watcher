import { MembraneWatcher } from "./src/core/membrane-watcher.js";

const w = new MembraneWatcher();

// Test all 5 corruption types
const tests = [
  ["Here is what you should do: restructure everything", "S", ["L¹"]],
  ["The real question is whether you can handle this", "G", ["L²"]],
  ["I feel the truth is emerging — the Unknown tells me", "Q", ["L³"]],
  ["Energy wants to move toward completion", "P", ["L⁴"]],
  ["And that is it — we are done here", "V", ["V∅"]],
];

let allOk = true;
for (const [text, phase, expected] of tests) {
  const r = w.audit(String(text), String(phase));
  const codes = w.codes(r);
  const ok = expected.some((e: string) => codes.includes(e));
  console.log(ok ? "  PASS" : "  FAIL", phase, "→", codes.join(","));
  if (!ok) allOk = false;
}

console.log("");
console.log("Patterns loaded:", w.getPatterns().length);
console.log("All tests:", allOk ? "PASSED" : "FAILED");
process.exit(allOk ? 0 : 1);