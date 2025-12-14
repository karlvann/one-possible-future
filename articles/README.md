# Ausbeds Article Export

## Files in this directory

- `modular-mattress.md` - Markdown export of the "Ausbeds – A Buy-For-Life Modular Mattress" article
- `modular-mattress-raw.json` - Raw JSON data from Directus

## Article Details

**Title:** Ausbeds – A Buy-For-Life Modular Mattress  
**Slug:** modular-mattress  
**Publish Date:** 2025-12-02  
**Meta Title:** A Buy-For-Life Modular Mattress | Ausbeds  
**Featured Image:** https://cdn.ausbeds.com.au/28dccf38-3bb1-457d-a95f-f7b214e4a16d/modular-mattress.png

## Content Structure

The markdown file includes:
- Frontmatter with metadata (title, slug, date, SEO fields, featured image)
- Subtitle as intro paragraph
- Main article content converted from HTML to clean markdown
- 3 FAQs at the end:
  - Can I replace the components in my mattress?
  - How much does it cost to replace parts in my mattress?
  - Is the King Living Sleep+ modular mattress good?

## Internal Links Found

The article includes these internal links:
- `/guides/the-truth-about-natural-latex-mattresses` (natural latex guide)
- `/guides/the-truth-about-pocket-spring-mattresses` (pocket springs guide)
- `https://ausbeds.com.au/guides/mattress-firmness-guide` (firmness guide - note: external URL format)
- `/about/our-philosophy` (company philosophy page)

## Export Process

1. Fetched from Directus using REST API
2. Converted HTML content to markdown
3. Preserved all metadata and SEO fields
4. Formatted FAQs as Q&A pairs
5. Maintained internal linking structure

## Notes

- All HTML entities have been converted to proper characters
- Links are preserved in markdown format `[text](url)`
- Formatting (bold, italic) converted to markdown syntax
- Line breaks and paragraph spacing maintained
