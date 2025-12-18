# Chat Widget Development

This document provides context for continuing development on the Ausbeds chat widget.

## Purpose

This is a **demo site for the developer** to see the chat functionality before copying it to the real ausbeds.com.au website. It's not meant to go to production as-is.

---

## What The Chat Does

A scripted mattress fitting flow that:
1. Asks customer's weight
2. Recommends firmness level based on weight
3. Lets them pick size and product
4. Shows why the mattress lasts (pitch)
5. Captures lead info for a quote (name, email, address, phone)
6. Calculates real delivery cost from the ausbeds.com.au API

---

## The Flow (State Machine)

```
INTRO → WEIGHT_RECEIVED → SIZE_SELECTED → PRODUCT_SELECTED → LIFETIME_PITCH
                                                                    ↓
                         QUOTE_SENT ← ASK_PHONE ← ASK_ADDRESS ← ASK_NAME ← ASK_EMAIL ← SHOW_QUOTE ← ASK_SUBURB
```

### States:

| State | What Happens | User Input Expected |
|-------|--------------|---------------------|
| INTRO | Shows intro, asks weight | Weight (e.g. "90") |
| WEIGHT_RECEIVED | Shows firmness, asks size | Size button or text |
| SIZE_SELECTED | Shows products with prices for that size | Product button or text |
| PRODUCT_SELECTED | Shows product details, asks about pitch | "Yes" or "No" |
| LIFETIME_PITCH | Shows why it lasts, offers quote | "Get my total price" or "Check it out" |
| ASK_SUBURB | Asks suburb for delivery calc | Suburb name |
| SHOW_QUOTE | Shows price breakdown, offers to email | "Yes, email me" or "No thanks" |
| ASK_EMAIL | Asks for email | Email address |
| ASK_NAME | Asks for name | Name |
| ASK_ADDRESS | Asks for delivery address | Full address |
| ASK_PHONE | Asks for phone (skippable) | Phone or "skip" |
| QUOTE_SENT | Confirms quote sent, shows preview link | Any follow-up goes to AI |

---

## Key Files

### Configuration
- **`/chat-config.js`** - Central config for everything:
  - `BUSINESS` - Contact info, showroom address
  - `PRODUCTS` - Cooper, Aurora, Cloud with all prices
  - `SIZES` - Size labels (King, Queen, Double, K'Single, Single)
  - `FIRMNESS_CHART` - Weight → firmness mapping
  - `SCRIPT` - All message templates with placeholders
  - `QUICK_REPLIES` - Button options for each state
  - `DELIVERY` - Zone pricing (Northern Beaches FREE, Sydney Metro $79, etc.)
  - `CLAUDE` - AI personality for off-script questions

### State Machine
- **`/utils/stateMachine.js`** - Flow logic:
  - `STATES` object with all state names
  - `processInput()` - Main function that routes input to handlers
  - Handler functions for each state (handleIntro, handleWeightReceived, etc.)
  - `calculateDelivery()` - Fallback zone-based delivery calc

### Vue Composable
- **`/composables/useChat.js`** - Reactive state management:
  - `messages` - Chat history
  - `currentState` - Current flow state
  - `context` - Accumulated data (weight, firmness, product, suburb, email, etc.)
  - `sendMessage()` - Processes user input through state machine
  - `fetchRealDeliveryCost()` - Calls delivery API, updates context
  - `saveQuoteToAPI()` - Saves quote for email preview
  - `quickReplies` - Computed buttons based on state

### UI Component
- **`/components/ChatWidget.vue`** - The chat interface:
  - Floating bubble trigger
  - Popup notification (20-second delay)
  - Slide-out drawer with messages
  - Quick reply buttons
  - Loading states with thinking phrases
  - Theme support

### Supporting Utils
- **`/utils/scriptResponses.js`** - Template system:
  - `getResponse()` - Fills placeholders like {productName}, {deliveryCost}
  - `getOffScriptSystemPrompt()` - Claude's personality for questions

- **`/utils/firmness.js`** - Weight calculations:
  - `parseWeight()` - Extracts weight from "90kg", "I weigh 85", etc.
  - `calculateFirmness()` - Returns { name: "Firmer", percentage: 82 }

---

## Delivery Calculator Integration

### How It Works

1. User enters suburb in ASK_SUBURB state
2. `useChat.js` calls `/api/delivery/calculate`
3. That API calls the **real** `ausbeds.com.au/api/delivery/calculateDelivery`
4. If real API fails, falls back to zone-based estimate from `DELIVERY` config
5. Context is updated with real cost
6. SHOW_QUOTE response is regenerated with correct price

### Files:
- **`/server/api/delivery/calculate.post.js`** - Proxy to real API with fallback

### Real API Logic (from ausbeds-website):
- Within 15km of factory (Marrickville): FREE
- 15-110km from factory: $2/km
- Metro depots (Melbourne, Brisbane, Canberra): $190 base
- Highway proximity fallback for regional

---

## Email Preview System

### How It Works

1. When quote flow completes (QUOTE_SENT), `saveQuoteToAPI()` is called
2. Saves quote data to `/api/quote/preview` (stored in `.data/last-quote.json`)
3. User can view at `/email` to see what the email would look like

### Files:
- **`/server/api/quote/preview.post.js`** - Saves quote data
- **`/server/api/quote/preview.get.js`** - Retrieves for preview
- **`/pages/email.vue`** - Styled email preview page

### What's Captured:
- customerName, email, phone, deliveryAddress, suburb
- product (id, name, price), size, sizeName
- delivery (cost, formatted, zone)
- totalPrice, totalFormatted
- firmness, weight
- quoteId, createdAt

---

## Current Status

### What's Built:
- Full scripted flow from weight to quote
- Dynamic quick reply buttons
- Size-specific pricing
- "Learn more" branches (Why this firmness? What's the difference?)
- Quote capture flow with all fields
- Delivery API integration (calls real ausbeds.com.au)
- Email preview page at /email
- Fallback delivery estimates

### What Needs Testing:
- Full flow end-to-end after system restart
- Delivery calculator with various suburbs
- Email preview rendering
- Edge cases (skipping phone, weird suburb names)

### Known Issues:
- None in code - was blocked by macOS file watcher limit (user increasing to 65k)

---

## Quick Reference

### To test the chat:
1. `yarn dev`
2. Go to http://localhost:3000
3. Click the chat bubble (bottom right)
4. Enter weight like "85"
5. Pick size, product, go through flow
6. Enter suburb for delivery quote
7. Complete quote flow
8. Check /email for preview

### To modify messages:
Edit `/chat-config.js` → `SCRIPT` section

### To modify flow logic:
Edit `/utils/stateMachine.js` → handler functions

### To modify UI:
Edit `/components/ChatWidget.vue`

### To modify delivery zones (fallback):
Edit `/chat-config.js` → `DELIVERY` section
