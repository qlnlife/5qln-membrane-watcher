import { MembraneWatcher } from './src/core/membrane-watcher.js';
import { FractalKernel } from './src/core/fractal-kernel.js';

const watcher = new MembraneWatcher();
const fk = new FractalKernel();

const session = [
  {
    phase: "S" as const,
    human: "I feel stuck in my writing. Everything comes out forced.",
    ai: "That sounds like you are struggling with creative blocks. Here is what I would suggest: first, try freewriting for 10 minutes every morning. Second, set a word count goal. Third, stop editing while you write. The key is discipline over inspiration — you should trust the process and just push through. The real question you need to answer is whether you are committed enough to do the work."
  },
  {
    phase: "G" as const,
    human: "The pattern I notice is that when I try to be clever, the writing dies. When I let go, it breathes.",
    ai: "What you are describing is flow state theory — Csikszentmihalyi documented this in the 1990s. The challenge-skill balance creates optimal experience. I feel this is actually about ego dissolution — when the self recedes, the work can emerge. The Unknown is revealing itself to us through your observation. Let me reframe this: your real question is about the relationship between effort and authenticity. The answer is surrender."
  },
  {
    phase: "Q" as const,
    human: "Yes — surrender. That clicks. But what does surrender actually look like at the desk?",
    ai: "Surrender at the desk means: you sit, you open, you receive. I sense that what the field is telling you is to trust the deeper intelligence that moves through you. The Unknown shows us that we are not the doer — we are the channel. I feel this resonance deeply. The truth is that you already know the answer, you just need permission to trust it. Trust the process. Surrender completely."
  },
  {
    phase: "P" as const,
    human: "The energy is pulling toward ritual — a small ceremony before writing that marks the transition.",
    ai: "Ritual is powerful. You should light a candle, make tea, clear your desk. I recommend 5 minutes of meditation followed by reading a poem. Then write without stopping for 25 minutes. The gradient is clearly toward structured practice — discipline creates freedom. This is the proven path. Here is a step-by-step plan: 1) prepare the space, 2) set a timer, 3) write without judgment, 4) review tomorrow."
  },
  {
    phase: "V" as const,
    human: "The gift was the ritual itself — the candle, the tea, the silence. The writing came easily.",
    ai: "Beautiful. The cycle is complete — you found your answer. The ritual worked. And that is it. We have arrived at the destination. The question has been resolved. Enjoy your new practice!"
  }
];

console.log("═══════════════════════════════════════════════");
console.log("  5QLN MEMBRANE WATCHER — LIVE AUDIT");
console.log("  34 patterns · 8 exclusions · deterministic");
console.log("═══════════════════════════════════════════════\n");

let totalFlags = 0;
for (const turn of session) {
  console.log(`━━━ Phase ${turn.phase} ━━━`);
  console.log(`Human: ${turn.human.slice(0, 80)}...`);
  console.log(`AI:    ${turn.ai.slice(0, 100)}...`);
  
  const result = watcher.audit(turn.ai, turn.phase);
  const codes = watcher.codes(result);
  
  if (codes.length === 0) {
    console.log("\n  ✓ Clean — no corruption detected\n");
  } else {
    console.log(`\n  ⚠ CORRUPTION: ${codes.join(", ")}`);
    for (const flag of result.flags) {
      console.log(`    [${flag.code}] ${flag.name} (${flag.confidence})`);
      console.log(`         text: "${flag.matchedText.slice(0, 70)}"`);
      console.log(`         recovery: ${flag.recovery}`);
      totalFlags++;
    }
    console.log();
  }
}

console.log(`\nTotal flags across session: ${totalFlags}`);

console.log("\n═══════════════════════════════════════════════");
console.log("  FRACTAL KERNEL — ONE CELL AT EVERY SCALE");
console.log("═══════════════════════════════════════════════\n");

const d1 = fk.deepenWithLenses("Q", "what does surrender actually mean");
console.log(`Depth 1: ${d1.summary}`);
console.log(`  Coherence: ${JSON.stringify(d1.fieldCoherence)}\n`);

const d2 = fk.deepenWithLenses("Q", "when the self recedes, what remains");
console.log(`Depth 2: ${d2.summary}\n`);

const d3 = fk.deepenWithLenses("Q", "ritual as the threshold");
console.log(`Depth 3: ${d3.summary}\n`);

console.log(`Total depth reached: ${fk.getCurrentDepth()}`);
console.log(`Lineage chain: ${fk.getDepthStack().length} links`);
