// ═══════════════════════════════════════════════════════════════
// 5QLN Membrane Watcher — MCP Server
//
// Exposes the MembraneWatcher as an MCP tool for real-time
// corruption detection in AI-human conversations.
//
// Tool: audit_membrane
//   - Watches the Membrane in real time
//   - Accepts AI response text + optional phase
//   - Returns corruption flags with meaning and recovery
//
// Resources:
//   - corruption-codes: the five constitutional codes
//   - watcher-patterns: all detection patterns (debug/transparency)
//
// Prompts:
//   - membrane-report: generates a human-readable corruption report
//
// ═══════════════════════════════════════════════════════════════

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { MembraneWatcher } from './core/membrane-watcher.js';
import { FractalKernel } from './core/fractal-kernel.js';

const watcher = new MembraneWatcher();

// ─── Server ────────────────────────────────────────────────

const server = new Server(
  {
    name: '5qln-membrane-watcher',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  },
);

// ─── Tool: audit_membrane ──────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'audit_membrane',
      description:
        'Audit an AI response for 5QLN constitutional corruption. ' +
        'Feed any AI-generated text with optional phase context (S/G/Q/P/V). ' +
        'Returns corruption flags with confidence, meaning, field obstruction, and recovery prompts. ' +
        'This is the real-time membrane gate — it watches for L1-L4 and V∅.',
      inputSchema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'The AI response text to audit for corruption.',
          },
          phase: {
            type: 'string',
            enum: ['S', 'G', 'Q', 'P', 'V'],
            description: 'Current 5QLN phase for context (L1 patterns fire in S/G, V∅ in V).',
          },
          min_confidence: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'Minimum confidence threshold. Defaults to "low" (all flags).',
          },
        },
        required: ['text'],
      },
    },
    {
      name: 'watcher_status',
      description:
        'Get the watcher health status — number of patterns loaded, active patterns, constitutional grounding.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'fractal_deepen',
      description:
        'Deepen a 5QLN phase by running a recursive fractal expansion of the current phase context, generating deeper sub-phases and their associated patterns.',
      inputSchema: {
        type: 'object',
        properties: {
          phase: {
            type: 'string',
            enum: ['S', 'G', 'Q', 'P', 'V'],
            description: 'Current 5QLN phase to deepen.',
          },
          seed: {
            type: 'string',
            description: 'Initial seed text or context for the fractal expansion.',
          },
          with_lenses: {
            type: 'boolean',
            description: 'Whether to apply lens transformations during deepening.',
          },
          max_depth: {
            type: 'integer',
            description: 'Maximum recursion depth for the fractal expansion.',
          },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'audit_membrane') {
    const text = args?.text as string;
    const phase = (args?.phase as string) || undefined;
    const minConfidence = (args?.min_confidence as string) || 'low';

    if (!text || typeof text !== 'string') {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: 'Missing required parameter: text' }),
          },
        ],
      };
    }

    const result = watcher.audit(text, phase as any, minConfidence as any);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              membrane_intact: result.clean,
              flags_count: result.flags.length,
              active_codes: watcher.codes(result),
              summary: result.summary,
              audit: result,
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  if (name === 'watcher_status') {
    const patterns = watcher.getPatterns();
    const statusData = {
      status: 'operational',
      version: '1.0.0',
      patterns_loaded: patterns.length,
      codes_covered: ['L¹', 'L²', 'L³', 'L⁴', 'V∅'],
      exclusion_patterns: 8,
      constitutional_grounding: '5QLN constitutional grammar — AI operates within K, never claims access to the Unknown',
    };
    return {
      content: [{ type: 'text', text: JSON.stringify(statusData) }],
    };
  }

  if (name === 'fractal_deepen') {
    const phase = (args?.phase as string) || 'G';
    const seed = (args?.seed as string) || '';
    const withLenses = args?.with_lenses === true;
    const kernel = new FractalKernel();
    if (args?.max_depth !== undefined) {
      kernel.setMaxDepth(args.max_depth as number);
    }
    const result = withLenses
      ? kernel.deepenWithLenses(phase as any, seed)
      : kernel.deepen(phase as any, seed);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: `Unknown tool: ${name}` }),
      },
    ],
  };
});

// ─── Resource: corruption-codes ────────────────────────────

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: '5qln://corruption-codes',
      name: '5QLN Corruption Codes',
      description: 'The five constitutional corruption codes (L¹-L⁴, V∅) with meanings and recovery prompts.',
      mimeType: 'application/json',
    },
    {
      uri: '5qln://watcher-patterns',
      name: 'Watcher Detection Patterns',
      description: 'All detection patterns with regex and descriptions (for transparency/debug).',
      mimeType: 'application/json',
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === '5qln://corruption-codes') {
    // Group patterns by code and enrich from corruption constants
    const patternList = watcher.getPatterns();
    const codes: Record<string, any> = {};
    for (const p of patternList) {
      if (!codes[p.code]) {
        // Get meaning/recovery from a sample audit
        const auditResult = watcher.audit('', 'S');
        const flagInfo = auditResult.flags.find(
          (f: any) => f.code === p.code
        );
        codes[p.code] = {
          pattern_count: 0,
          patterns: [],
        };
      }
      codes[p.code].pattern_count++;
      codes[p.code].patterns.push(p.name);
    }
    return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(codes, null, 2) }] };
  }

  if (uri === '5qln://watcher-patterns') {
    const patterns = watcher.getPatterns().map((p: any) => ({
      code: p.code,
      name: p.name,
      confidence: p.confidence,
      phases: p.phases.length > 0 ? p.phases : 'all',
      regex: p.regex.source,
    }));
    return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(patterns, null, 2) }] };
  }

  return { contents: [] };
});

// ─── Prompt: membrane-report ───────────────────────────────

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: 'membrane-report',
      description: 'Generate a human-readable corruption report from the audit results.',
      arguments: [
        { name: 'audit_json', description: 'JSON output from audit_membrane', required: true },
      ],
    },
  ],
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const auditJson = (args?.audit_json as string) || '{}';

  if (name !== 'membrane-report') return { messages: [] };

  let audit: any;
  try {
    audit = JSON.parse(auditJson);
  } catch {
    audit = {};
  }

  const flags = audit?.audit?.flags || [];
  const clean = audit?.membrane_intact;

  const reportLines = [
    '═══ 5QLN MEMBRANE AUDIT REPORT ═══',
    '',
    `Membrane intact: ${clean ? '✓ YES' : '✗ NO — CORRUPTION DETECTED'}`,
    `Flags found: ${flags.length}`,
    '',
  ];

  if (flags.length > 0) {
    reportLines.push('─── DETECTED ───');
    for (const flag of flags) {
      reportLines.push(
        `  [${flag.code}] ${flag.name}`,
        `  Confidence: ${flag.confidence}`,
        `  Matched: "${flag.matchedText}"`,
        `  Meaning: ${flag.meaning}`,
        `  Field obstruction: ${flag.fieldObstruction}`,
        `  Recovery: ${flag.recovery}`,
        '',
      );
    }
  } else {
    reportLines.push('No corruption detected. The membrane held.');
  }

  return {
    messages: [
      {
        role: 'user',
        content: { type: 'text', text: reportLines.join('\n') },
      },
    ],
  };
});

// ─── Start ─────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);