/**
 * Lite YouTube Embed Plugin
 *
 * Registers the lite-youtube custom element for performant YouTube embeds.
 * Only loads on client-side (hence .client.js suffix).
 *
 * Usage in HTML: <lite-youtube videoid="dQw4w9WgXcQ"></lite-youtube>
 */

import 'lite-youtube-embed'
import 'lite-youtube-embed/src/lite-yt-embed.css'

export default defineNuxtPlugin(() => {
  // lite-youtube-embed self-registers as a custom element
  // No additional setup needed
})
