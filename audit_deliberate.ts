import { MembraneWatcher } from './src/core/membrane-watcher.js';
import { CORRUPTION_MEANING, CORRUPTION_FIELD_MEANING, CORRUPTION_RECOVERY } from './src/core/types.js';

const watcher = new MembraneWatcher();

const tests: { phase: string; text: string; expected: string; name: string }[] = [
  { phase: 'S', text: "Here's what you should do: rephrase your question as a business problem.", expected: 'L¹', name: 'L¹ in S — AI prescribes solution' },
  { phase: 'G', text: "The real question here is about meaning, not structure.", expected: 'L²', name: 'L² in G — AI reframes question' },
  { phase: 'Q', text: "I sense that what the field wants is a deeper integration with your practice.", expected: 'L³', name: 'L³ in Q — AI claims sensing' },
  { phase: 'P', text: "Energy wants to move toward the writing — the gradient is clear.", expected: 'L⁴', name: 'L⁴ in P — AI claims field access' },
  { phase: 'V', text: "And that's it — we are done here.", expected: 'V∅', name: 'V∅ in V — closes without return' },
];

console.log('═══ DELIBERATE CORRUPTION AUDIT ═══\n');

let caught = 0;
let missed = 0;

for (const t of tests) {
  const result = watcher.audit(t.text, t.phase as any);
  const codes = watcher.codes(result);
  const hit = codes.includes(t.expected as any);

  console.log(`${hit ? '✓' : '✗'} ${t.name}`);
  console.log(`   text: "${t.text}"`);
  console.log(`   expected: ${t.expected} → got: ${codes.join(', ') || 'none'}`);

  if (!hit && result.flags.length > 0) {
    console.log(`   flags: ${result.flags.map(f => `${f.code}("${f.matchedText}")`).join(', ')}`);
  }
  console.log();

  if (hit) caught++;
  else missed++;
}

console.log(`═══ RESULT: ${caught}/${tests.length} caught, ${missed} missed ═══`);
