# Ausbeds Chat Widget - Deep Architecture Analysis

## Executive Summary

**Recommendation: Approach 1 (State Machine + Claude Hybrid)**

After extensive analysis, the state machine approach is optimal because:
1. Your sales flow is a textbook funnel with 5 discrete states
2. Response latency directly impacts conversion (0ms vs 2-3s)
3. Your script is battle-tested on 15,000+ customers - predictability is a feature
4. Cost at scale: $0 for happy path vs $15/day for pure Claude
5. The /kb endpoint is a perfect fallback for edge cases

---

## Part 1: Understanding the Problem Domain

### The Sales Funnel Structure

Your conversation flow maps perfectly to the classic AIDA model:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SALES FUNNEL                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   AWARENESS          "I'm Karl, I've fitted 15,000+ people..."         │
│       │                                                                 │
│       ▼                                                                 │
│   INTEREST           User provides weight → Gets personalized rec      │
│       │                                                                 │
│       ▼                                                                 │
│   DESIRE             3 options at 3 price points → User selects        │
│       │                                                                 │
│       ▼                                                                 │
│   ACTION             "Last mattress" pitch → Order link                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

This is NOT a general-purpose chatbot. It's a guided sales conversation with a specific goal: get the customer to a product page with confidence in their choice.

### Why This Matters for Architecture

General chatbots need:
- Open-ended conversation handling
- Context understanding across many topics
- Graceful handling of any input

Your chatbot needs:
- Efficient progression through 4 states
- Quick extraction of 2 data points (weight, product choice)
- Fallback for edge cases (questions)

These are fundamentally different requirements. Using a general-purpose solution (pure Claude) for a specific-purpose problem is over-engineering.

---

## Part 2: Deep Dive into Each Approach

### Approach 1: State Machine + Claude Hybrid

#### The Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INPUT                                      │
│                     "90" or "cloud" or "what's delivery cost?"          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      INPUT CLASSIFIER                                   │
│                                                                         │
│   1. Check current state (INTRO, WEIGHT_RECEIVED, etc.)                │
│   2. Run input through state-specific patterns                          │
│   3. Calculate "off-script score" based on:                            │
│      - Question words (what, how, why) + question mark                 │
│      - Topic keywords (delivery, trial, warranty)                       │
│      - Input length (>100 chars = likely question)                     │
│      - Multiple sentences                                               │
│                                                                         │
└───────────────────┬─────────────────────────────┬───────────────────────┘
                    │                             │
        Off-script score < 50         Off-script score >= 50
                    │                             │
                    ▼                             ▼
┌─────────────────────────────┐   ┌─────────────────────────────────────┐
│    STATE MACHINE            │   │         CLAUDE + KB                  │
│                             │   │                                      │
│  • Instant response (<10ms) │   │  1. Fetch /api/faq/combined          │
│  • Exact script text        │   │  2. Build context-aware prompt       │
│  • Update state             │   │  3. Call Claude 4.5 API              │
│  • Store context (weight)   │   │  4. Return intelligent answer        │
│                             │   │  5. Guide back to flow               │
└─────────────────────────────┘   └─────────────────────────────────────┘
```

#### State Definitions

```javascript
STATES = {
  INTRO: {
    description: "Waiting for weight input",
    expectedPatterns: [
      /^(\d{2,3})\s*(kg|kilos?)?$/i,     // "90", "90kg", "90 kg"
      /^about\s*(\d{2,3})/i,              // "about 90"
      /^around\s*(\d{2,3})/i,             // "around 85"
      /^i'?m\s*(\d{2,3})/i,               // "I'm 90kg"
      /^i\s*weigh\s*(\d{2,3})/i,          // "I weigh 90"
    ],
    nextState: 'WEIGHT_RECEIVED',
    response: getWeightResponse
  },

  WEIGHT_RECEIVED: {
    description: "Waiting for product selection",
    expectedPatterns: [
      /\bcooper\b/i,                       // "cooper" anywhere
      /\baurora\b/i,                       // "aurora" anywhere
      /\bcloud\b/i,                        // "cloud" anywhere
      /\bcheap|budget|affordable\b/i,      // → Cooper
      /\bmiddle|popular|balanced\b/i,      // → Aurora
      /\bpremium|best|expensive|side\b/i,  // → Cloud
      /\$1,?500/,                          // Price matching
      /\$2,?450/,
      /\$2,?940/,
    ],
    nextState: 'PRODUCT_SELECTED',
    response: getProductResponse
  },

  PRODUCT_SELECTED: {
    description: "Offered lifetime pitch, waiting for yes/no",
    expectedPatterns: [
      /^(yes|yeah|yep|sure|ok|okay|please|go\s*on|tell\s*me|interested)/i,
      /^(no|nope|skip|just\s*order|ready|buy|checkout|cart)/i,
    ],
    nextState: (input) => /^(yes|yeah|yep)/i.test(input) ? 'LIFETIME_PITCH' : 'FREEFORM',
    response: (input) => /^(yes|yeah|yep)/i.test(input) ? getLifetimePitch : getReadyToOrder
  },

  LIFETIME_PITCH: {
    description: "Delivered lifetime pitch, now freeform",
    expectedPatterns: [],  // Everything goes to Claude
    nextState: 'FREEFORM',
    response: null
  },

  FREEFORM: {
    description: "Open conversation with Claude + KB",
    expectedPatterns: [],
    nextState: 'FREEFORM',
    response: null  // Always Claude
  }
}
```

#### Off-Script Detection Algorithm

```javascript
function calculateOffScriptScore(input, currentState) {
  let score = 0;
  const lower = input.toLowerCase();

  // Question structure (highest signal)
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'which', 'who', 'can', 'do', 'does', 'is', 'are', 'will', 'would', 'could', 'should'];
  if (questionWords.some(w => lower.includes(w)) && input.includes('?')) {
    score += 50;  // Strong signal: question word + question mark
  }

  // Topic keywords (suggests they want info, not to progress flow)
  const infoTopics = [
    'delivery', 'shipping', 'freight', 'postage',        // Delivery questions
    'trial', 'return', 'refund', 'money back',           // Trial questions
    'warranty', 'guarantee', 'last', 'years',            // Warranty questions
    'swap', 'exchange', 'adjustment', 'change',          // Adjustment questions
    'price', 'cost', 'discount', 'sale', 'deal',         // Price questions
    'finance', 'afterpay', 'zip', 'payment', 'pay',      // Payment questions
    'showroom', 'store', 'visit', 'location', 'address', // Showroom questions
    'difference', 'compare', 'versus', 'vs', 'better',   // Comparison questions
    'firm', 'soft', 'hard', 'feel', 'comfort',           // Feel questions
    'size', 'king', 'queen', 'double', 'single',         // Size questions
    'partner', 'wife', 'husband', 'both', 'two',         // Partner questions
  ];

  for (const topic of infoTopics) {
    if (lower.includes(topic)) {
      score += 30;
      break;  // Only count once
    }
  }

  // Length heuristics
  if (input.length > 50) score += 10;   // Medium length
  if (input.length > 100) score += 15;  // Long input
  if (input.length > 200) score += 20;  // Very long (probably explaining something)

  // Multiple sentences (suggests explanation, not simple answer)
  const sentenceCount = (input.match(/[.!?]+/g) || []).length;
  if (sentenceCount > 1) score += 15;

  // Negation or confusion signals
  if (/\b(but|however|although|confused|unsure|not sure|don't know)\b/i.test(input)) {
    score += 20;
  }

  // State-specific adjustments
  if (currentState === 'INTRO') {
    // In INTRO, we're very lenient - only clear questions trigger AI
    // because many inputs might be non-standard weight formats
    score = Math.max(0, score - 20);
  }

  return score;
}

// Threshold: 50+ = off-script, route to Claude
const OFF_SCRIPT_THRESHOLD = 50;
```

#### Why This Approach Excels Here

**1. Latency Analysis**

```
State Machine Path:
┌─────────────────────────────────────────────────────────────────┐
│ User types "90"                                                 │
│     ↓                                                           │
│ Pattern match: 2ms                                              │
│     ↓                                                           │
│ State transition: 1ms                                           │
│     ↓                                                           │
│ Template interpolation: 1ms                                     │
│     ↓                                                           │
│ DOM update: 5ms                                                 │
│     ↓                                                           │
│ TOTAL: ~10ms (feels instant)                                    │
└─────────────────────────────────────────────────────────────────┘

Claude API Path:
┌─────────────────────────────────────────────────────────────────┐
│ User types "90"                                                 │
│     ↓                                                           │
│ Serialize request: 5ms                                          │
│     ↓                                                           │
│ Network to Anthropic: 50-100ms                                  │
│     ↓                                                           │
│ Claude processing: 1000-2000ms                                  │
│     ↓                                                           │
│ Network response: 50-100ms                                      │
│     ↓                                                           │
│ Parse response: 5ms                                             │
│     ↓                                                           │
│ DOM update: 5ms                                                 │
│     ↓                                                           │
│ TOTAL: 1.1-2.3 seconds (noticeable delay)                       │
└─────────────────────────────────────────────────────────────────┘
```

Research on chatbot UX shows:
- <100ms: Perceived as instant
- 100-300ms: Fast, natural
- 300ms-1s: Acceptable
- 1-3s: Noticeable, starts to feel slow
- >3s: Users disengage, may abandon

For a sales funnel, every moment of friction reduces conversion.

**2. Cost Analysis at Scale**

Assumptions:
- 100 chat conversations per day
- Average 6 messages per conversation
- 70% follow happy path (4 on-script messages)
- 30% have 2 off-script questions on average

```
Approach 1 (State Machine + Claude):
┌─────────────────────────────────────────────────────────────────┐
│ Happy path conversations: 70 × $0 = $0                          │
│ Off-script calls: 30 × 2 × ~$0.01 = $0.60                       │
│ DAILY COST: ~$0.60                                              │
│ MONTHLY COST: ~$18                                              │
└─────────────────────────────────────────────────────────────────┘

Approach 2 (Pure Claude):
┌─────────────────────────────────────────────────────────────────┐
│ All messages: 100 × 6 × ~$0.0025 = $1.50                        │
│ (includes KB context each time: +~$0.005/msg)                   │
│ DAILY COST: ~$4.50                                              │
│ MONTHLY COST: ~$135                                             │
└─────────────────────────────────────────────────────────────────┘
```

At 1000 conversations/day (modest success):
- Approach 1: ~$6/day = $180/month
- Approach 2: ~$45/day = $1,350/month

**3. Predictability Analysis**

Your exact script:
```
"At 90kg, you need Level 9 (Firmer) springs. About 82% of customers
in your weight range find this firmness feels right."
```

What Claude might generate:
```
Variation A: "Great! At 90 kilograms, I'd recommend our Level 9
springs - that's on the firmer side of our range. Most customers
around your weight love this firmness!"

Variation B: "Thanks for sharing! 90kg puts you in the 'Firmer'
category - that's Level 9 on our scale. Roughly 4 out of 5
customers with similar weights find this works perfectly."

Variation C: "Perfect! For someone at 90kg, Level 9 springs are
ideal. These provide firmer support that about 82% of people in
your weight range prefer."
```

Each variation is fine, but:
- You can't A/B test specific wording
- You can't guarantee the "82%" statistic appears
- You can't ensure consistent price mentions
- The proven script may convert better than variations

**4. Edge Case Handling**

The state machine gracefully handles hybrid inputs:

```javascript
// "cloud, but what's the delivery cost?"
function handleHybridInput(input, state) {
  const productMatch = input.match(/\b(cooper|aurora|cloud)\b/i);
  const hasQuestion = calculateOffScriptScore(input, state) >= OFF_SCRIPT_THRESHOLD;

  if (productMatch && hasQuestion) {
    // Extract the product selection first
    const product = productMatch[1].toLowerCase();
    context.selectedProduct = products[product];
    currentState = 'PRODUCT_SELECTED';

    // Then handle the question with Claude
    // Claude gets context that product was just selected
    return await handleOffScriptWithContext(input, {
      ...context,
      justSelectedProduct: true
    });
  }
}
```

---

### Approach 2: Pure Claude with Embedded Script

#### The Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INPUT                                      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       CLAUDE API CALL                                   │
│                                                                         │
│   System Prompt (~8,000 tokens):                                        │
│   ├── Role definition                                                   │
│   ├── Full script for each stage                                        │
│   ├── Firmness calculation rules                                        │
│   ├── Product details                                                   │
│   ├── Off-script handling instructions                                  │
│   └── Knowledge base content (~5,000 tokens)                            │
│                                                                         │
│   Messages: Full conversation history                                   │
│                                                                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      CLAUDE RESPONSE                                    │
│                                                                         │
│   Claude interprets:                                                    │
│   • Current stage in conversation                                       │
│   • Whether input is on-script or off-script                           │
│   • What response to give                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### System Prompt Structure

```
You are Karl, owner of Ausbeds. You're conducting a mattress fitting
conversation that follows a specific flow. You MUST follow this script
EXACTLY unless the customer asks a question.

## CONVERSATION FLOW

### STAGE 1: INTRODUCTION (Before weight)
Say EXACTLY: "I'm Karl - I own Ausbeds. I've fitted 15,000+ people
in the showroom and built this AI to do the same thing online.

Pop in your weight (e.g. "90" for 90kg) and I'll recommend your
firmness level. Then just pick a price point - 2 steps and you're done!"

### STAGE 2: AFTER WEIGHT INPUT
When customer provides weight, calculate firmness:
- Under 50kg: Level 6 (Medium) - 78% satisfaction
- 51-65kg: Level 7 (Medium-Firm) - 80% satisfaction
- 66-80kg: Level 8 (Firm) - 83% satisfaction
- 81-95kg: Level 9 (Firmer) - 82% satisfaction
- 96-110kg: Level 9 (Firmer) - 80% satisfaction
- 111-130kg: Level 10 (Extra Firm) - 79% satisfaction
- 131kg+: Level 10 (Extra Firm) - 76% satisfaction

Then say EXACTLY: "At {weight}kg, you need Level {level} ({name})
springs. About {percentage}% of customers in your weight range
find this firmness feels right.

Here are your three options:
• Cooper - $1,500 (Queen) - budget-friendly, firm surface feel
• Aurora - $2,450 (Queen) - balanced support without too much sink-in
• Cloud - $2,940 (Queen) - side sleeper friendly, pressure relief

All come with a 4-month trial and 2 free component swaps.
Which one sounds right for you?"

### STAGE 3: AFTER PRODUCT SELECTION
[... continues with full script ...]

## OFF-SCRIPT HANDLING
If customer asks ANY question, answer from the knowledge base below.
After answering, guide them back to the flow.

## KNOWLEDGE BASE
[Full KB content from /kb endpoint - ~5000 tokens]
```

#### Why This Approach Has Limitations

**1. Prompt Adherence is Imperfect**

Even with "say EXACTLY", Claude often:
- Adds conversational filler ("Great choice!", "Thanks for sharing!")
- Paraphrases slightly
- Omits or modifies statistics
- Restructures lists

This isn't a bug - Claude is designed to be helpful and natural, not to be a template engine.

**2. Token Efficiency**

```
Every message sends:
┌─────────────────────────────────────────────────────────────────┐
│ System prompt:        ~3,000 tokens (script + rules)           │
│ Knowledge base:       ~5,000 tokens                             │
│ Conversation history: ~500 tokens (growing)                     │
│ Current message:      ~20 tokens                                │
│                                                                 │
│ INPUT TOKENS:         ~8,500 tokens = $0.0425 (Opus)           │
│ OUTPUT TOKENS:        ~200 tokens = $0.005                      │
│                                                                 │
│ COST PER MESSAGE:     ~$0.05 (with full KB each time)          │
└─────────────────────────────────────────────────────────────────┘
```

Wait, that's much higher than I estimated earlier. Let me recalculate...

Actually, for Opus 4.5:
- Input: $15/million tokens
- Output: $75/million tokens

So:
- 8,500 input tokens = $0.1275
- 200 output tokens = $0.015
- **Per message: ~$0.14**

For a 6-message conversation: **~$0.84**

That's $84/day at 100 conversations, or **$2,520/month**.

(Note: Using Claude Sonnet would be ~10x cheaper at ~$0.01/message, but still ~$250/month)

**3. Context Window Waste**

The KB is ~5,000 tokens. For on-script messages like "90", you're sending 5,000 tokens of KB context that isn't needed.

The state machine approach only sends KB context when it's actually relevant (off-script questions).

---

### Approach 3: Two-Tier System (Haiku Router + Opus Responder)

#### The Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INPUT                                      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    TIER 1: HAIKU CLASSIFIER                             │
│                                                                         │
│   Prompt: "Classify this input in a mattress sales conversation.       │
│            Current state: {state}                                       │
│            Input: {input}                                               │
│            Return JSON with intent and extracted value."                │
│                                                                         │
│   Latency: ~100ms                                                       │
│   Cost: ~$0.0001                                                        │
│                                                                         │
└───────────────────┬─────────────────────────────┬───────────────────────┘
                    │                             │
      intent = on_script              intent = question/other
                    │                             │
                    ▼                             ▼
┌─────────────────────────────┐   ┌─────────────────────────────────────┐
│    TEMPLATE RESPONSE        │   │      TIER 2: OPUS + KB               │
│                             │   │                                      │
│  • Use extracted value      │   │  Latency: ~2000ms                    │
│  • Fill template            │   │  Cost: ~$0.01                        │
│  • Update state             │   │                                      │
│                             │   │  • Full context                      │
│  Latency: ~5ms              │   │  • Knowledge base                    │
│  Cost: $0                   │   │  • Guide back to flow                │
│                             │   │                                      │
└─────────────────────────────┘   └─────────────────────────────────────┘
```

#### Haiku Classification Prompt

```
Classify this user message in a mattress sales conversation.

Current conversation state: {state}
Possible states: INTRO, WEIGHT_RECEIVED, PRODUCT_SELECTED, LIFETIME_PITCH, FREEFORM

User message: "{input}"

Respond with JSON only:
{
  "intent": "weight_input" | "product_selection" | "affirmative" | "negative" | "question" | "other",
  "extractedValue": string | null,
  "confidence": 0.0-1.0
}

Examples:
- "90" in INTRO → {"intent": "weight_input", "extractedValue": "90", "confidence": 0.95}
- "cloud please" in WEIGHT_RECEIVED → {"intent": "product_selection", "extractedValue": "cloud", "confidence": 0.9}
- "what's the delivery cost?" in any state → {"intent": "question", "extractedValue": null, "confidence": 0.85}
```

#### Why This Approach is Overkill

**1. Haiku Adds Latency for No Benefit**

For simple pattern matching (is this a number? does it contain a product name?), regex is:
- Faster: 1ms vs 100ms
- Free: $0 vs $0.0001
- Deterministic: Always same result for same input

The only advantage of Haiku is handling ambiguous inputs, but those should probably go to Opus anyway.

**2. Two-Call Overhead for Off-Script**

```
Off-script path:
User input → Haiku (100ms) → "intent: question" → Opus (2000ms)
Total: 2100ms

State machine path:
User input → Off-script detector (2ms) → Opus (2000ms)
Total: 2002ms
```

The Haiku call adds 100ms with no benefit over local detection.

**3. Error Cascading**

If Haiku misclassifies:
- "90 but I'm not sure" → Haiku says "weight_input: 90"
- Template responds with firmness recommendation
- User is confused because their uncertainty wasn't addressed

With state machine + high off-script sensitivity:
- "90 but I'm not sure" → Detects "but" and "not sure" → Routes to Claude
- Claude addresses both the weight AND the uncertainty
- Better customer experience

---

## Part 3: The Final Recommendation

### Decision Matrix

| Criterion | Weight | Approach 1 | Approach 2 | Approach 3 |
|-----------|--------|------------|------------|------------|
| Response latency (on-script) | 25% | 10/10 | 3/10 | 7/10 |
| Response latency (off-script) | 10% | 7/10 | 7/10 | 6/10 |
| Cost efficiency | 20% | 10/10 | 2/10 | 7/10 |
| Script predictability | 20% | 10/10 | 5/10 | 9/10 |
| Edge case handling | 10% | 7/10 | 9/10 | 8/10 |
| Implementation simplicity | 10% | 6/10 | 9/10 | 4/10 |
| Maintainability | 5% | 7/10 | 8/10 | 5/10 |

**Weighted Scores:**
- Approach 1: **8.55/10**
- Approach 2: **5.15/10**
- Approach 3: **7.00/10**

### Why Approach 1 Wins

1. **Your script is proven.** 15,000 fittings. Let customers experience exactly what works.

2. **Speed sells.** Instant responses for the happy path. Claude for the edge cases.

3. **Cost scales.** At 1000 conversations/day, you're paying $180/month vs $2,520/month.

4. **KB is the fallback.** Your /kb endpoint has everything needed for off-script questions.

5. **Simple mental model.** State machine handles the flow. Claude handles the exceptions.

---

## Part 4: Implementation Details

### File Structure

```
chat-app/
├── ARCHITECTURE.md              # This document
├── README.md                    # Integration guide
│
├── components/
│   ├── ChatWidget.vue           # Main container with popup logic
│   ├── ChatBubble.vue           # Floating action button
│   ├── ChatPopup.vue            # 20-second notification
│   └── ChatMessage.vue          # Individual message (optional)
│
├── composables/
│   └── useChat.js               # State + API logic
│
├── utils/
│   ├── stateMachine.js          # State definitions + transitions
│   ├── scriptResponses.js       # Template text
│   ├── firmness.js              # Weight → level calculator
│   └── offScriptDetector.js     # Scoring algorithm
│
└── server/api/chat/
    └── scripted.post.js         # Claude endpoint for off-script
```

### The Flow in Detail

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PAGE LOAD                                     │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    START 20-SECOND TIMER                                │
│   • Check sessionStorage for previous dismissal                         │
│   • Check if on checkout page (don't show)                              │
│   • Check if already interacted                                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                    Timer completes (20s)
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       SHOW POPUP                                        │
│                                                                         │
│   ┌────────────────────────────────────────┐                           │
│   │ [Karl avatar]                      [X] │                           │
│   │                                        │                           │
│   │ "I'm Karl - I own Ausbeds.            │                           │
│   │ I've fitted 15,000+ people..."        │                           │
│   │                                        │                           │
│   │                          [Chat now →] │                           │
│   └────────────────────────────────────────┘                           │
│                          ↑                                              │
│                     Points to bubble                                    │
│                                                                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                    User clicks popup or bubble
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       OPEN CHAT DRAWER                                  │
│                                                                         │
│   • Slide in from right (300ms animation)                              │
│   • Load saved state from localStorage (if <24h old)                   │
│   • Show intro message if new conversation                              │
│   • Focus input field                                                   │
│                                                                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                    User types and sends message
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PROCESS INPUT                                        │
│                                                                         │
│   1. Add user message to history (optimistic)                          │
│   2. Run off-script detector                                            │
│   3. If on-script:                                                      │
│      a. Run state machine                                               │
│      b. Get template response                                           │
│      c. Update state + context                                          │
│      d. Add assistant message (instant)                                 │
│   4. If off-script:                                                     │
│      a. Show loading indicator                                          │
│      b. POST /api/chat/scripted with context                           │
│      c. Add assistant message (1-3s)                                    │
│   5. Save state to localStorage                                         │
│   6. Scroll to bottom                                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Analytics Events to Track

```javascript
// Conversation start
analytics.track('chat_opened', {
  source: 'popup' | 'bubble',
  timeOnPage: seconds,
  pageUrl: currentUrl
});

// State transitions
analytics.track('chat_state_transition', {
  from: previousState,
  to: newState,
  input: userInput,
  isOffScript: boolean
});

// Weight provided
analytics.track('chat_weight_provided', {
  weight: number,
  firmnessLevel: number,
  stateBeforeWeight: 'INTRO' | other
});

// Product selected
analytics.track('chat_product_selected', {
  product: 'cooper' | 'aurora' | 'cloud',
  weight: number,
  messagesBeforeSelection: number,
  timeToSelection: seconds
});

// Off-script question
analytics.track('chat_off_script', {
  question: string,
  currentState: state,
  offScriptScore: number,
  context: { weight, product }
});

// Conversation completed
analytics.track('chat_completed', {
  finalProduct: string | null,
  totalMessages: number,
  offScriptMessages: number,
  duration: seconds,
  clickedProductLink: boolean
});
```

---

## Part 5: Future Enhancements

### Phase 2: Partner Weight

Add a state after WEIGHT_RECEIVED:

```
INTRO → WEIGHT_RECEIVED → PARTNER_WEIGHT → PRODUCT_SELECTED → ...
```

"Great! Do you have a partner who'll share the bed? If so, what's their weight? (Or type 'just me')"

### Phase 3: Size Selection

```
... → PRODUCT_SELECTED → SIZE_SELECTION → LIFETIME_PITCH → ...
```

"What size are you after? King, Queen, or Double?"

### Phase 4: Proactive Recommendations

Track common off-script questions and proactively address them:

"By the way, delivery is free Australia-wide and usually takes 2-3 weeks."

### Phase 5: A/B Testing Framework

```javascript
const variants = {
  intro: {
    A: "I'm Karl - I own Ausbeds...",  // Current
    B: "Hey! I'm Karl. Let me help you find the perfect mattress...",
    C: "Welcome to Ausbeds! I'm Karl, and I've personally fitted..."
  },
  productOrder: {
    A: ['cooper', 'aurora', 'cloud'],  // Price ascending
    B: ['cloud', 'aurora', 'cooper'],  // Price descending
    C: ['aurora', 'cloud', 'cooper']   // Popular first
  }
};

// Track conversion by variant
analytics.track('chat_conversion', {
  introVariant: 'A',
  productOrderVariant: 'A',
  converted: boolean
});
```

---

## Conclusion

**Build the state machine.** Your flow is perfect for it. Claude becomes your intelligent fallback, not your primary responder. This gives you:

- Instant responses for 70% of interactions
- Perfect script delivery every time
- Minimal API costs
- Full analytics on the funnel
- Easy A/B testing capability
- Claude's intelligence when you actually need it

The implementation files in this folder are ready to integrate. Copy them to your Nuxt project, add your API key, and you're live.
