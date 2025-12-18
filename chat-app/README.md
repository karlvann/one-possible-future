# Ausbeds Chat Widget

A smart chatbot that guides customers through mattress selection using a scripted sales flow, with Claude 4.5 as fallback for off-script questions.

## Quick Start

### 1. Copy Files to Your Nuxt Project

```bash
# Copy the components
cp -r chat-app/components/* components/

# Copy the composable
cp -r chat-app/composables/* composables/

# Copy the utilities
mkdir -p utils
cp -r chat-app/utils/* utils/

# Copy the API route
mkdir -p server/api/chat
cp chat-app/server/api/chat/scripted.post.js server/api/chat/
```

### 2. Add Environment Variable

```env
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

### 3. Add Karl's Avatar Image

Place an image at `/public/images/karl-avatar.jpg` (or update the path in `ChatWidget.vue`)

### 4. Add to Your Layout

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <Header />
    <slot />
    <Footer />

    <!-- Add the chat widget -->
    <ChatWidget :popup-delay="20000" />
  </div>
</template>

<script setup>
import ChatWidget from '~/components/ChatWidget.vue'
</script>
```

## How It Works

### State Machine Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        INTRO                                │
│  "I'm Karl - I own Ausbeds..."                             │
│  Waiting for: weight input (e.g., "90")                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ User enters weight
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   WEIGHT_RECEIVED                           │
│  "At 90kg, you need Level 9..."                            │
│  Shows: Cooper, Aurora, Cloud options                       │
│  Waiting for: product selection                            │
└───────────────────────────┬─────────────────────────────────┘
                            │ User selects product
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  PRODUCT_SELECTED                           │
│  "Perfect choice! Cloud at $2,940..."                      │
│  Asks: "Want to know how this becomes your last mattress?" │
│  Waiting for: yes/no                                       │
└───────────────────────────┬─────────────────────────────────┘
                            │ User says yes
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   LIFETIME_PITCH                            │
│  "Here's why Cloud becomes your last mattress..."          │
│  Lists: durability benefits                                │
│  Ends with: order link                                     │
└───────────────────────────┬─────────────────────────────────┘
                            │ Any follow-up
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      FREEFORM                               │
│  All messages sent to Claude + KB                          │
│  Handles: any off-script questions                         │
└─────────────────────────────────────────────────────────────┘
```

### Off-Script Detection

The state machine detects off-script inputs:
- Questions (contains "what", "how", "why" + "?")
- Topic keywords (delivery, trial, warranty, etc.)
- Long messages (>100 characters)
- Compare/contrast requests

Off-script questions are sent to Claude 4.5 with:
- Full conversation context (weight, selected product)
- Knowledge base from `/api/faq/combined`
- Instructions to guide back to sales flow

## File Structure

```
chat-app/
├── README.md                    # This file
├── ARCHITECTURE.md              # Detailed architecture doc
│
├── components/
│   ├── ChatWidget.vue           # Main widget (drawer + state)
│   ├── ChatBubble.vue           # Floating trigger button
│   └── ChatPopup.vue            # 20-second popup notification
│
├── composables/
│   └── useChat.js               # State management composable
│
├── utils/
│   ├── stateMachine.js          # FSM logic and transitions
│   ├── scriptResponses.js       # Templated response text
│   └── firmness.js              # Weight → firmness calculator
│
└── server/api/chat/
    └── scripted.post.js         # Claude API for off-script
```

## Customization

### Change Popup Delay

```vue
<ChatWidget :popup-delay="30000" /> <!-- 30 seconds -->
```

### Modify Script Responses

Edit `utils/scriptResponses.js`:

```javascript
export const RESPONSES = {
  INTRO: `Your custom intro message...`,
  WEIGHT_RECEIVED: `At {weight}kg, you need...`,
  // ...
}
```

### Adjust Firmness Levels

Edit `utils/firmness.js`:

```javascript
const WEIGHT_CHART = [
  [0, 50, 6, 78],     // [minWeight, maxWeight, level, percentage]
  [51, 65, 7, 80],
  // ...
]
```

### Add Products

Edit `utils/scriptResponses.js`:

```javascript
const PRODUCT_DETAILS = {
  cooper: { name: 'Cooper', price: 1500, ... },
  aurora: { name: 'Aurora', price: 2450, ... },
  cloud: { name: 'Cloud', price: 2940, ... },
  // Add new products here
}
```

## API Reference

### POST /api/chat/scripted

Called when user goes off-script.

**Request:**
```json
{
  "question": "What's the difference between Aurora and Cloud?",
  "context": {
    "weight": 90,
    "firmness": { "level": 9, "name": "Firmer" },
    "selectedProduct": { "id": "cloud", "name": "Cloud" },
    "currentState": "PRODUCT_SELECTED"
  },
  "messages": [
    { "role": "assistant", "content": "I'm Karl..." },
    { "role": "user", "content": "90" },
    { "role": "assistant", "content": "At 90kg..." }
  ]
}
```

**Response:**
```json
{
  "answer": "Great question! Aurora has 1,600 micro springs..."
}
```

## Cost Estimation

| Scenario | API Calls | Cost |
|----------|-----------|------|
| Happy path (weight → product → order) | 0 | $0.00 |
| 1 off-script question | 1 | ~$0.01 |
| Full conversation (10 messages, 3 off-script) | 3 | ~$0.03 |

Claude Opus 4.5 pricing:
- Input: $5/million tokens
- Output: $25/million tokens

## Troubleshooting

### Chat doesn't appear
- Check that `ChatWidget` is imported in your layout
- Verify the component is inside the `<template>` tag

### API errors
- Verify `ANTHROPIC_API_KEY` is set in `.env`
- Check the API key is valid at console.anthropic.com

### Popup doesn't show
- Popup only shows if user hasn't interacted with chat
- Check `popup-delay` prop value (milliseconds)

### KB context missing
- Verify `/api/faq/combined` endpoint returns content
- Check Notion FAQ database is accessible

## License

Part of the Ausbeds website project.
