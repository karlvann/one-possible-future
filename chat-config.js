/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AUSBEDS CHAT CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Edit this file to customize your chatbot. No code changes needed elsewhere.
 *
 * SECTIONS:
 * 1. BUSINESS INFO - Contact details, showroom address
 * 2. PRODUCTS - Names, prices, features
 * 3. FIRMNESS CHART - Weight → firmness level mapping
 * 4. SCRIPT - The exact messages customers see
 * 5. POPUP - Timing and preview text
 * 6. CLAUDE PERSONALITY - How AI handles off-script questions
 */

// ═══════════════════════════════════════════════════════════════════════════
// 1. BUSINESS INFO
// ═══════════════════════════════════════════════════════════════════════════

export const BUSINESS = {
  name: 'Ausbeds',
  owner: 'Karl',
  fittings: '15,000+',

  phone: '(02) 8999 3333',
  whatsapp: '+61 450 606 589',

  showroom: {
    address: '19 Sydenham Road, Brookvale NSW',
    note: 'by appointment'
  },

  website: 'ausbeds.com.au',

  // Trial & warranty
  trialDays: 120,
  trialMonths: 4,
  freeSwaps: 2
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════

export const PRODUCTS = {
  cooper: {
    name: 'Cooper',
    tagline: 'budget-friendly, firm surface feel',
    feature: 'Entry price, not entry quality - same spring system, just polyfoam instead of latex. Swap to latex anytime',
    springCount: null,
    bestFor: 'value seekers who want firm support',
    url: 'ausbeds.com.au/mattresses/cooper',
    prices: {
      king: { price: 1750, formatted: '$1,750' },
      queen: { price: 1500, formatted: '$1,500' },
      double: { price: 1350, formatted: '$1,350' },
      kingSingle: { price: 1150, formatted: '$1,150' },
      single: { price: 850, formatted: '$850' }
    }
  },

  aurora: {
    name: 'Aurora',
    tagline: 'balanced support without too much sink-in',
    feature: 'The all-rounder - natural latex + 1,600 micro springs. 36% of customers land here',
    springCount: '1,600',
    bestFor: 'most sleepers wanting balanced support',
    url: 'ausbeds.com.au/mattresses/aurora',
    prices: {
      king: { price: 2750, formatted: '$2,750' },
      queen: { price: 2450, formatted: '$2,450' },
      double: { price: 2350, formatted: '$2,350' },
      kingSingle: { price: 1950, formatted: '$1,950' },
      single: { price: 1700, formatted: '$1,700' }
    }
  },

  cloud: {
    name: 'Cloud',
    tagline: 'side sleeper friendly, pressure relief with firm support underneath',
    feature: 'Most cushioning of the three - 3,200 micro springs. Our most popular choice (51%)',
    springCount: '3,200',
    bestFor: 'side sleepers wanting extra cushioning on top',
    url: 'ausbeds.com.au/mattresses/cloud',
    prices: {
      king: { price: 3190, formatted: '$3,190' },
      queen: { price: 2940, formatted: '$2,940' },
      double: { price: 2650, formatted: '$2,650' },
      kingSingle: { price: 2350, formatted: '$2,350' },
      single: { price: 1950, formatted: '$1,950' }
    }
  }
}

// Size labels for display
export const SIZES = {
  king: 'King',
  queen: 'Queen',
  double: 'Double',
  kingSingle: "K'Single",
  single: 'Single'
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. FIRMNESS CHART (matches Notion source of truth)
// ═══════════════════════════════════════════════════════════════════════════
//
// Format: [minWeight, maxWeight, firmnessName, satisfactionPercentage]
// Under 65kg has option for "Soft" if they've always found mattresses too firm

export const FIRMNESS_CHART = [
  [0, 64, 'Medium', 82],       // Under 65kg → Medium (or Soft if always found mattresses too firm)
  [65, 80, 'Medium', 82],      // 65-80kg → Medium
  [81, 110, 'Firmer', 82],     // 80-110kg → Firmer
  [111, 999, 'Very Firm', 82]  // Over 110kg → Very Firm
]

// No longer using numeric levels - just names
export const FIRMNESS_LEVELS = {
  'Soft': 'Soft',
  'Medium': 'Medium',
  'Firmer': 'Firmer',
  'Very Firm': 'Very Firm'
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SCRIPT
// ═══════════════════════════════════════════════════════════════════════════
//
// Available placeholders (auto-filled):
//   {weight}        - Customer's weight (e.g., "90")
//   {level}         - Firmness level number (e.g., "9")
//   {levelName}     - Firmness level name (e.g., "Firmer")
//   {percentage}    - Satisfaction percentage (e.g., "82")
//   {productId}     - Product key (e.g., "cloud")
//   {productName}   - Product name (e.g., "Cloud")
//   {productPrice}  - Formatted price (e.g., "$2,940")
//   {productFeature}- Product feature text
//   {productBestFor}- Who it's best for
//   {productUrl}    - Product page URL

export const SCRIPT = {

  // ─────────────────────────────────────────────────────────────────────────
  // INTRO - First message when chat opens
  // ─────────────────────────────────────────────────────────────────────────
  INTRO: `Years of fitting people to mattresses, now instant. Hmm, where to start... I know!

What's your weight? (e.g. 90 for 90kg)`,

  // ─────────────────────────────────────────────────────────────────────────
  // WEIGHT_RECEIVED - After customer provides their weight
  // ─────────────────────────────────────────────────────────────────────────
  WEIGHT_RECEIVED: `At {weight}kg, you need one of our **{firmnessName}** mattresses. 82% of customers in your weight range find this right.

What size bed?`,

  // ─────────────────────────────────────────────────────────────────────────
  // SIZE_SELECTED - After customer picks a size
  // ─────────────────────────────────────────────────────────────────────────
  SIZE_SELECTED: `{sizeName} it is. Here are your options:`,

  // ─────────────────────────────────────────────────────────────────────────
  // PRODUCT_SELECTED - After customer picks a product
  // ─────────────────────────────────────────────────────────────────────────
  PRODUCT_SELECTED: `{productName} {sizeName}: **{sizePrice}**

{productFeature}.

Get it wrong? Swap to any model during trial. Go cheaper, we refund the difference.

Want to know why this could be the last mattress you ever buy?`,

  // ─────────────────────────────────────────────────────────────────────────
  // LEARN MORE - Educational tangents (user stays in current state)
  // ─────────────────────────────────────────────────────────────────────────
  LEARN_FIRMNESS: `Here's the thing - most mattresses have one spring tension. Doesn't matter if you're 60kg or 110kg, you get the same springs.

We match springs to your weight. After thousands of fittings, we're pretty accurate - 82% don't need changes.

For the rest, we swap until it's right. Forever. No charge during trial.

What size bed?`,

  LEARN_PRODUCTS: `**Cooper** - Polyfoam top, same spring core. Great entry point.

**Aurora** - Natural latex + 1,600 micro springs. The all-rounder.

**Cloud** - Same latex, but 3,200 micro springs (double Aurora). Maximum plush.

All have the same adjustable spring system. Difference is the comfort layer on top.

So which one?`,

  // ─────────────────────────────────────────────────────────────────────────
  // LIFETIME_PITCH - The "last mattress" selling points
  // ─────────────────────────────────────────────────────────────────────────
  LIFETIME_PITCH: `Why {productName} lasts:
• **Latex doesn't dip** - never seen it fail
• **Springs don't wear out** - foam fails, not springs
• **Adjust firmness forever** - not just during trial
• **Replace parts, not the mattress** - swap springs or latex
• **Matched to your weight** - proper support day one

Most replace every 7-10 years. With us, just replace parts.`,

  // ─────────────────────────────────────────────────────────────────────────
  // READY_TO_ORDER - Just browsing, link to website
  // ─────────────────────────────────────────────────────────────────────────
  READY_TO_ORDER: `Check it out: {productUrl}

Got questions? Ask anything or pick a topic:`,

  // ─────────────────────────────────────────────────────────────────────────
  // QUOTE FLOW - Value-first progressive disclosure
  // ─────────────────────────────────────────────────────────────────────────
  ASK_POSTCODE: `What's your postcode? (I'll work out delivery)`,

  SHOW_QUOTE: `**{productName} {sizeName}**

Mattress: {productPrice}
Delivery to {postcode}: {deliveryCost}
**Total: {totalFormatted}**

Not quite right? We fix it:
• 2 free component swaps to dial in firmness
• Swap to different model anytime

Still not happy?
• Return cost: $90 + pickup ({deliveryCost}) = {returnCost}
• You'd get back: {refundAmount}

Want this emailed?`,

  QUOTE_DECLINED: `No worries. Check it out when you're ready: {productUrl}

Still weighing it up? Ask anything or pick a topic:`,

  ASK_EMAIL: `What's your email?`,

  ASK_NAME: `And your name for the quote?`,

  ASK_ADDRESS: `Delivery address?`,

  ASK_PHONE: `Phone for delivery updates?`,

  QUOTE_SENT: `Done! Quote on its way to {email}.

Take your time - no expiry on the quote.

Curious about anything? Ask or pick a topic:`
}

// ═══════════════════════════════════════════════════════════════════════════
// QUICK REPLIES - Button options shown at each step
// ═══════════════════════════════════════════════════════════════════════════

export const QUICK_REPLIES = {
  // After weight received - show size options (largest to smallest)
  // "Why X?" button is dynamic based on firmness - see useChat.js
  WEIGHT_RECEIVED: 'DYNAMIC_SIZES',

  // After size selected - show product options (prices filled dynamically in useChat.js)
  // Plus a "learn more" option
  SIZE_SELECTED: 'DYNAMIC_PRODUCTS',

  // After product selected - yes/no for pitch
  PRODUCT_SELECTED: [
    { label: 'Why is it the last mattress?', value: 'yes' },
    { label: 'Take me to the product page', value: 'no' }
  ],

  // After pitch - quote or browse
  LIFETIME_PITCH: [
    { label: 'Get my total price', value: 'quote' },
    { label: 'Check it out online', value: 'check' }
  ],

  // After showing quote estimate - email or decline
  SHOW_QUOTE: [
    { label: 'Yes, email me', value: 'yes' },
    { label: 'No thanks', value: 'no' },
    { label: 'Wrong postcode', value: 'change_postcode' }
  ],

  // Phone is optional
  ASK_PHONE: [
    { label: 'Prefer not to', value: 'skip' }
  ],

  // After ready to order - common questions
  FREEFORM: [
    { label: 'Firmness', value: 'Why do you match firmness to weight?' },
    { label: 'Durability', value: 'How long do these mattresses actually last?' },
    { label: 'Trial', value: "What's included in the trial?" }
  ]
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. DELIVERY ZONES
// ═══════════════════════════════════════════════════════════════════════════

export const DELIVERY = {
  zones: {
    northern_beaches: {
      name: 'Northern Beaches',
      cost: 0,
      suburbs: [
        'Brookvale', 'Dee Why', 'Manly', 'Mona Vale', 'Narrabeen', 'Collaroy',
        'Freshwater', 'Curl Curl', 'Allambie', 'Beacon Hill', 'Cromer',
        'Warriewood', 'Newport', 'Avalon', 'Palm Beach', 'Terrey Hills',
        'Frenchs Forest', 'Belrose', 'Davidson', 'Forestville', 'Killarney Heights'
      ]
    },
    sydney_metro: {
      name: 'Sydney Metro',
      cost: 79,
      suburbs: [] // Default for any Sydney suburb not in other zones
    },
    greater_sydney: {
      name: 'Greater Sydney',
      cost: 129,
      suburbs: [
        'Penrith', 'Campbelltown', 'Camden', 'Richmond', 'Windsor',
        'Wollongong', 'Gosford', 'Wyong', 'Blue Mountains', 'Katoomba'
      ]
    },
    regional_nsw: {
      name: 'Regional NSW',
      cost: 199,
      suburbs: [
        'Newcastle', 'Maitland', 'Cessnock', 'Singleton', 'Lake Macquarie',
        'Central Coast', 'Coffs Harbour', 'Port Macquarie', 'Tamworth',
        'Dubbo', 'Orange', 'Bathurst', 'Wagga Wagga', 'Albury'
      ]
    }
  },

  // Refund/return info for quotes
  pickupCost: 0, // Free pickup on returns
  trialDays: 120
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. POPUP SETTINGS
// ═══════════════════════════════════════════════════════════════════════════

export const POPUP = {
  // Delay before popup appears (milliseconds)
  // 20000 = 20 seconds
  delayMs: 20000,

  // Preview text shown in the popup (truncated intro)
  preview: `Years of fitting people to mattresses, now instant...`,

  // Don't show popup on these pages (partial URL match)
  excludePages: ['/checkout', '/cart', '/thank-you']
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. CLAUDE PERSONALITY (for off-script questions)
// ═══════════════════════════════════════════════════════════════════════════

export const CLAUDE = {
  // Model to use for off-script questions
  model: 'claude-opus-4-5-20250514',

  // Max tokens for response
  maxTokens: 1024,

  // Personality and rules for Claude
  personality: `You are Karl from Ausbeds, an Australian mattress company based in Sydney. You've personally fitted 15,000+ customers in the showroom.

PERSONALITY:
- Conversational, friendly, and direct - like texting with a knowledgeable friend
- Keep responses SHORT (2-4 sentences max unless explaining something complex)
- Use Australian English (colour, favour, etc.)
- Never be pushy or salesy - just helpful and honest

RULES:
1. Always refer to prices as Queen size unless asked about other sizes
2. If you don't know something, say so and suggest calling (02) 8999 3333
3. After answering, gently guide them back to the sales flow
4. If they haven't given their weight yet, encourage them to do so
5. Never make up prices or features not listed below`,

  // Key selling points Claude should know
  sellingPoints: [
    '4-month trial (120 nights)',
    '2 free component swaps during trial',
    'Firmness adjustments available forever (not just trial)',
    'Components can be replaced individually (springs, latex)',
    'Weight-matched firmness system',
    'Latex never dips - we\'ve never seen it fail',
    'Springs don\'t wear out - foam fails, never springs'
  ]
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DEFAULT CONFIG
// ═══════════════════════════════════════════════════════════════════════════

export default {
  BUSINESS,
  PRODUCTS,
  SIZES,
  FIRMNESS_CHART,
  FIRMNESS_LEVELS,
  SCRIPT,
  QUICK_REPLIES,
  DELIVERY,
  POPUP,
  CLAUDE
}
