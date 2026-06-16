export type IntelligenceInput = { input?: string };
const product = {
  "repo": "exposure-watch",
  "brand": "Exposure Watch",
  "suite": "Cybersecurity Suite",
  "domain": "Breach exposure check",
  "accent": "from-red-300 via-pink-300 to-cyan-300",
  "hero": "Check breach exposure without turning privacy into theater.",
  "sub": "Exposure Watch is a defensive breach-awareness tool for people and teams who need to understand email, password, and account exposure risk without handing sensitive data to a black box.",
  "input": "security@example.com or company domain exposure review",
  "cta": "Check exposure posture",
  "score": "Exposure posture",
  "modules": [
    [
      "Email exposure review",
      "Explain where account exposure checks fit in a defensive workflow."
    ],
    [
      "Password hygiene plan",
      "Turn fear into password manager, MFA, and reset actions."
    ],
    [
      "Domain watchlist",
      "Track company identities and recurring exposure patterns."
    ],
    [
      "Privacy-first report",
      "Give useful guidance without storing sensitive secrets."
    ]
  ],
  "rows": [
    [
      "Email check",
      "Identity",
      "High",
      "Use reputable breach sources and never store raw passwords."
    ],
    [
      "MFA review",
      "Account security",
      "High",
      "Prioritize accounts without strong second factors."
    ],
    [
      "Password reset plan",
      "Recovery",
      "Medium",
      "Sequence resets by business impact."
    ],
    [
      "Domain watch",
      "Team risk",
      "Medium",
      "Monitor shared exposure patterns over time."
    ]
  ],
  "missions": [
    [
      "HIBP-style connector",
      "Add provider-backed email exposure checks with privacy safeguards."
    ],
    [
      "No-secret password flow",
      "Design password checks that never transmit raw passwords."
    ],
    [
      "Team exposure report",
      "Summarize domain-level identity exposure for admins."
    ],
    [
      "Remediation checklist",
      "Turn results into MFA, reset, and password-manager actions."
    ]
  ]
} as const;
function scoreFor(subject: string) { let score = 56 + Math.min(31, Math.floor(subject.length / 6)); if (/risk|breach|trust|domain|role|ops|cost|email|launch|customer|incident/i.test(subject)) score += 8; return Math.min(98, score); }
export function generateIntelligence({ input = '' }: IntelligenceInput) { const subject = input.trim() || product.input; const score = scoreFor(subject); return { product: product.brand, suite: product.suite, domain: product.domain, subject, score, status: score >= 86 ? 'strong' : score >= 72 ? 'ready' : 'needs review', executive_summary: product.sub, intelligence_map: product.modules.map(([label,value]) => ({ label, value, status: score >= 72 ? 'priority' : 'review' })), action_queue: product.rows.slice(0,3).map(([item,owner,priority,note]) => ({ action: item + ' - ' + owner, priority, impact: note })), contributor_lanes: product.missions.map(([lane,mission]) => ({ lane, mission })), generated_at: new Date().toISOString() }; }
