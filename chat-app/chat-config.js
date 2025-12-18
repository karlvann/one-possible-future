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
    price: 1500,
    priceFormatted: '$1,500',
    tagline: 'budget-friendly, firm surface feel',
    feature: 'budget-friendly with quality components',
    springCount: null,
    bestFor: 'value seekers who want firm support',
    url: 'ausbeds.com.au/mattresses/cooper'
  },

  aurora: {
    name: 'Aurora',
    price: 2450,
    priceFormatted: '$2,450',
    tagline: 'balanced support without too much sink-in',
    feature: 'balanced support with 1,600 micro springs',
    springCount: '1,600',
    bestFor: 'most sleepers - our most popular choice',
    url: 'ausbeds.com.au/mattresses/aurora'
  },

  cloud: {
    name: 'Cloud',
    price: 2940,
    priceFormatted: '$2,940',
    tagline: 'side sleeper friendly, pressure relief with firm support underneath',
    feature: 'maximum pressure relief with 3,200 micro springs - double what Aurora has',
    springCount: '3,200',
    bestFor: 'side sleepers and those wanting that sink-in feel',
    url: 'ausbeds.com.au/mattresses/cloud'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. FIRMNESS CHART
// ═══════════════════════════════════════════════════════════════════════════
//
// Format: [minWeight, maxWeight, level, satisfactionPercentage]
//
// Level names:
//   6 = Medium
//   7 = Medium-Firm
//   8 = Firm
//   9 = Firmer
//   10 = Extra Firm

export const FIRMNESS_CHART = [
  [0, 50, 6, 78],      // Under 50kg → Level 6 (78% satisfaction)
  [51, 65, 7, 80],     // 51-65kg → Level 7 (80% satisfaction)
  [66, 80, 8, 83],     // 66-80kg → Level 8 (83% satisfaction)
  [81, 95, 9, 82],     // 81-95kg → Level 9 (82% satisfaction)
  [96, 110, 9, 80],    // 96-110kg → Level 9 (80% satisfaction)
  [111, 130, 10, 79],  // 111-130kg → Level 10 (79% satisfaction)
  [131, 999, 10, 76]   // 130kg+ → Level 10 (76% satisfaction)
]

export const FIRMNESS_LEVELS = {
  6: 'Medium',
  7: 'Medium-Firm',
  8: 'Firm',
  9: 'Firmer',
  10: 'Extra Firm'
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
  INTRO: `I'm Karl - I own Ausbeds. I've fitted 15,000+ people in the showroom and built this AI to do the same thing online.

Pop in your weight (e.g. "90" for 90kg) and I'll recommend your firmness level. Then just pick a price point - 2 steps and you're done!`,

  // ─────────────────────────────────────────────────────────────────────────
  // WEIGHT_RECEIVED - After customer provides their weight
  // ─────────────────────────────────────────────────────────────────────────
  WEIGHT_RECEIVED: `At {weight}kg, you need Level {level} ({levelName}) springs. About {percentage}% of customers in your weight range find this firmness feels right.

Here are your three options:

• **Cooper** - $1,500 (Queen) - budget-friendly, firm surface feel

• **Aurora** - $2,450 (Queen) - balanced support without too much sink-in

• **Cloud** - $2,940 (Queen) - side sleeper friendly, pressure relief with firm support underneath

All come with a 4-month trial and 2 free component swaps if adjustments are needed.

Which one sounds right for you?`,

  // ─────────────────────────────────────────────────────────────────────────
  // PRODUCT_SELECTED - After customer picks a product
  // ─────────────────────────────────────────────────────────────────────────
  PRODUCT_SELECTED: `Perfect choice! {productName} at {productPrice} (Queen) gives you {productFeature}. Great for {productBestFor}.

Here's your link: {productUrl}

Want to know how this becomes the last mattress you'll ever buy?`,

  // ─────────────────────────────────────────────────────────────────────────
  // LIFETIME_PITCH - The "last mattress" selling points
  // ─────────────────────────────────────────────────────────────────────────
  LIFETIME_PITCH: `Here's why {productName} becomes your last mattress:

• **Latex doesn't dip** - we've never seen it fail

• **Springs don't wear out** - it's always foam that fails, never springs

• **Adjust firmness anytime** - not just during trial, forever

• **Replace components, not the whole mattress** - swap springs or latex

• **Matched to your body weight** - proper support from day one

Most people replace mattresses every 7-10 years. With us, you just replace parts when needed.

Ready to order? Here's the link: {productUrl}. Or ask me anything else.`,

  // ─────────────────────────────────────────────────────────────────────────
  // READY_TO_ORDER - If customer skips the lifetime pitch
  // ─────────────────────────────────────────────────────────────────────────
  READY_TO_ORDER: `No problem! Here's your link to order: {productUrl}

If you have any questions before ordering, just ask. I'm here to help.`
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. POPUP SETTINGS
// ═══════════════════════════════════════════════════════════════════════════

export const POPUP = {
  // Delay before popup appears (milliseconds)
  // 20000 = 20 seconds
  delayMs: 20000,

  // Preview text shown in the popup (truncated intro)
  preview: `I'm Karl - I own Ausbeds. I've fitted 15,000+ people...`,

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
  FIRMNESS_CHART,
  FIRMNESS_LEVELS,
  SCRIPT,
  POPUP,
  CLAUDE
}
