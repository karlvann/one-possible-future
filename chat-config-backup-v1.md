# Chat Config Backup - V1 (Text-only flow)

Saved: December 2024
Before: Adding quick reply buttons

---

## Flow Summary

1. **INTRO** → User types weight
2. **WEIGHT_RECEIVED** → User types product name
3. **PRODUCT_SELECTED** → User types "yes/ok" for pitch
4. **LIFETIME_PITCH** → User clicks link or asks questions
5. **READY_TO_ORDER** → Alternative if they skip pitch

---

## SCRIPT Messages

### INTRO
```
Years of fitting people to mattresses, now instant. Hmm, where to start... I know! What's your weight? (e.g. 90 for 90kg)
```

### WEIGHT_RECEIVED
```
At {weight}kg, you need Level {level} ({levelName}) springs. About {percentage}% of customers in your weight range find this right.

Your options:
• **Cooper** $1,500 - budget-friendly, firm feel
• **Aurora** $2,450 - balanced, no sink-in
• **Cloud** $2,940 - side sleeper friendly, pressure relief

All Queen prices. 4-month trial, 2 free swaps if needed. Which one?
```

### PRODUCT_SELECTED
```
{productName} at {productPrice} - {productFeature}. Great for {productBestFor}.

Link: {productUrl}

Want to know why this could be your last mattress?
```

### LIFETIME_PITCH
```
Why {productName} lasts:
• **Latex doesn't dip** - never seen it fail
• **Springs don't wear out** - foam fails, not springs
• **Adjust firmness forever** - not just during trial
• **Replace parts, not the mattress** - swap springs or latex
• **Matched to your weight** - proper support day one

Most people replace every 7-10 years. With us, just replace parts.

Ready? {productUrl}
```

### READY_TO_ORDER
```
No worries! Here's your link: {productUrl}

Any questions, just ask.
```

---

## POPUP

```javascript
{
  delayMs: 20000,
  preview: "Years of fitting people to mattresses, now instant..."
}
```

---

## Header/Footer Text

- **Header Title:** "Chat with Karl's Brain"
- **Header Subtitle:** "Every mattress question he's ever answered, searchable"
- **Footer:** "Powered by Karl's brain"

---

## Thinking Phrases

### Quick (scripted responses, 1.5-2.5 sec delay)
- Got it...
- Yep...
- Right...
- Easy one...
- One sec...
- Here we go...
- Sure thing...
- On it...

### Deep (AI/RAG responses)
- Digging through the archives...
- Good question, let me look that up properly...
- Searching the knowledge base...
- Hmm, let me check my notes on that...
- Rummaging through 20 years of stuff...
- That's in here somewhere...
- Let me find the right answer for that...
- Give me a sec, want to get this right...
- Checking the files...
- Pulling up the details...
- One of those questions... hang on...
- Need to dig for that one...

---

## Sizing (ChatWidget.vue)

```css
.chat-drawer {
  width: 400px;
  height: 700px;
  max-height: calc(100vh - 40px);
}

.chat-messages {
  padding: 12px;
  gap: 8px;
}

.chat-bubble {
  padding: 10px 14px;
  line-height: 1.4;
  max-width: 88%;
}
```

---

## Theme (Sunset only)

```javascript
sunset: {
  userBubbleBg: '#FFE5A8',      // Yellow pastel
  assistantBubbleBg: '#FFC2CB', // Pink pastel
  sendBg: '#DD8B11',            // Amber
  triggerBg: '#FFE5A8',         // Yellow
  drawerBg: '#f7f7f7',          // Light cream
}
```
