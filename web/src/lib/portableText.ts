import {createImageUrlBuilder} from '@sanity/image-url'
import {sanity} from './sanity'

const imageBuilder = createImageUrlBuilder(sanity)

const BLOCK_TAGS: Record<string, string> = {
  normal: 'p',
  h2: 'h2',
  h3: 'h3',
  blockquote: 'blockquote',
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function renderSpan(span: any, markDefs: any[]) {
  let html = escapeHtml(span.text || '')
  for (const mark of span.marks || []) {
    if (mark === 'strong') html = `<b>${html}</b>`
    else if (mark === 'em') html = `<i>${html}</i>`
    else if (mark === 'underline') html = `<u>${html}</u>`
    else {
      const def = markDefs?.find((d: any) => d._key === mark)
      if (def?._type === 'link' && def.href) html = `<a href="${escapeHtml(def.href)}">${html}</a>`
    }
  }
  return html
}

// Minimal Portable Text -> HTML renderer. Current migrated content is plain
// paragraph blocks, but this also supports the headings/marks/images the
// Sanity schema allows for future editing.
export function portableTextToHtml(blocks: any[] = []): string {
  return blocks
    .map((block) => {
      if (block._type === 'image' && block.asset) {
        const src = imageBuilder.image(block).width(1200).url()
        return `<img src="${src}" alt="" loading="lazy">`
      }
      if (block._type !== 'block') return ''
      const tag = BLOCK_TAGS[block.style] || 'p'
      const inner = (block.children || []).map((span: any) => renderSpan(span, block.markDefs)).join('')
      return `<${tag}>${inner}</${tag}>`
    })
    .join('\n')
}
