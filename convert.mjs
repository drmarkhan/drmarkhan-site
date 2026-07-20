// Converts published-content.json (legacy admin.js export format) into
// posts.ndjson for `npx sanity dataset import posts.ndjson production`.
//
// Field order for each collection mirrors admin.js exactly (positional arrays):
//   notes:   [id, date, category, title, excerpt, ideaTags, workTags, researchTags, meta?]
//   essays:  [id, date, category, title, excerpt, body, ideaTags, workTags, researchTags, meta?]
//   concepts:[code, stage, title, description]
//   projects:[id, status, area, title, subtitle, problem, approach, next]
//   research:[id, stage, percent, question, hypothesis, method]
//
// This source file predates admin.js's "Publishing workflow upgrade", so no
// note/essay has a meta object. app.js treats missing meta as status:'published',
// so every note/essay here is live on the current site — all are imported as
// status: 'published'. Slugs are generated with the exact same slugify()
// admin.js itself uses (Korean-preserving, no romanization).

import {readFileSync, writeFileSync} from 'node:fs'

const SOURCE = new URL('./published-content.json', import.meta.url)
const source = JSON.parse(readFileSync(SOURCE, 'utf8'))

const docs = []
const warnings = []
const seenSlugs = new Map() // slug -> count, for collision suffixing

// Same algorithm as admin.js slugify(), minus its NFKD-decomposition bug
// (NFKD splits Hangul syllables into Jamo, which the charset regex then
// strips, collapsing nearly every Korean-only title to "untitled").
// Keeps Hangul as-is — this does not romanize, per user decision.
function slugify(v = '') {
  return (
    String(v)
      .toLowerCase()
      .trim()
      .replace(/<[^>]*>/g, '')
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90) || 'untitled'
  )
}

function uniqueSlug(base) {
  const count = seenSlugs.get(base) || 0
  seenSlugs.set(base, count + 1)
  if (count === 0) return base
  const deduped = `${base}-${count + 1}`
  warnings.push(`슬러그 충돌: "${base}" 중복 → "${deduped}"로 변경`)
  return deduped
}

// Same regex admin.js's normalizeDate() uses: "2026.07.19" / "2026-07-19" -> "2026-07-19"
function normalizeDate(v = '') {
  const m = String(v)
    .trim()
    .match(/^(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/)
  return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : String(v).slice(0, 10)
}

function stripTags(html) {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|blockquote|li)>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

let keyCounter = 0
function key() {
  keyCounter += 1
  return `k${keyCounter.toString(36)}`
}

function textToBlocks(value = '') {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(String(value))
  const raw = isHtml ? stripTags(String(value)) : String(value)
  const paragraphs = raw
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean)
  if (isHtml && paragraphs.length) {
    warnings.push(`서식 유실: HTML 본문을 일반 텍스트 문단으로 변환함 (굵게/링크/이미지 등 손실) — "${paragraphs[0].slice(0, 30)}..."`)
  }
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }))
}

function legacyMeta(item, metaIdx, dateIdx, excerptIdx) {
  const existing = item[metaIdx]
  if (existing && typeof existing === 'object' && !Array.isArray(existing)) return existing
  const title = item[3]
  const publishedAt = normalizeDate(item[dateIdx])
  return {
    status: 'published',
    slug: slugify(title),
    publishedAt,
    updatedAt: publishedAt,
    seoTitle: '',
    seoDescription: item[excerptIdx] || '',
    coverImage: '',
    canonical: '',
  }
}

// --- notes ---
for (const item of source.notes || []) {
  const meta = legacyMeta(item, 8, 1, 4)
  const slug = uniqueSlug(meta.slug || slugify(item[3]))
  docs.push({
    _id: `note-${item[0]}`,
    _type: 'note',
    legacyId: item[0],
    title: item[3],
    slug: {_type: 'slug', current: slug},
    category: item[2],
    excerpt: item[4],
    status: meta.status,
    publishedAt: `${meta.publishedAt}T00:00:00Z`,
    updatedAt: `${meta.updatedAt}T00:00:00Z`,
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    canonical: meta.canonical || undefined,
    ideaTags: item[5] || [],
    workTags: item[6] || [],
    researchTags: item[7] || [],
    language: 'ko',
  })
}

// --- essays ---
for (const item of source.essays || []) {
  const meta = legacyMeta(item, 9, 1, 4)
  const slug = uniqueSlug(meta.slug || slugify(item[3]))
  docs.push({
    _id: `essay-${item[0]}`,
    _type: 'essay',
    legacyId: item[0],
    title: item[3],
    slug: {_type: 'slug', current: slug},
    category: item[2],
    excerpt: item[4],
    status: meta.status,
    publishedAt: `${meta.publishedAt}T00:00:00Z`,
    updatedAt: `${meta.updatedAt}T00:00:00Z`,
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    canonical: meta.canonical || undefined,
    body: textToBlocks(item[5]),
    ideaTags: item[6] || [],
    workTags: item[7] || [],
    researchTags: item[8] || [],
    language: 'ko',
    featured: false,
  })
}

// --- concepts ---
for (const item of source.concepts || []) {
  docs.push({
    _id: `concept-${item[0]}`,
    _type: 'concept',
    legacyId: item[0],
    code: item[0],
    stage: item[1],
    title: item[2],
    description: textToBlocks(item[3]),
  })
}

// --- projects ---
for (const item of source.projects || []) {
  docs.push({
    _id: `project-${item[0]}`,
    _type: 'project',
    legacyId: item[0],
    status: item[1],
    area: item[2],
    title: item[3],
    subtitle: item[4],
    problem: textToBlocks(item[5]),
    approach: textToBlocks(item[6]),
    next: textToBlocks(item[7]),
  })
}

// --- research ---
for (const item of source.research || []) {
  docs.push({
    _id: `researchQuestion-${item[0]}`,
    _type: 'researchQuestion',
    legacyId: item[0],
    stage: item[1],
    percent: item[2],
    question: item[3],
    hypothesis: textToBlocks(item[4]),
    method: textToBlocks(item[5]),
  })
}

const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n'
writeFileSync(new URL('./posts.ndjson', import.meta.url), ndjson)

const counts = {
  notes: (source.notes || []).length,
  essays: (source.essays || []).length,
  concepts: (source.concepts || []).length,
  projects: (source.projects || []).length,
  research: (source.research || []).length,
}
const total = Object.values(counts).reduce((a, b) => a + b, 0)

console.log('변환 완료:', JSON.stringify(counts))
console.log('원본 총 개수:', total, '/ 생성된 문서 수:', docs.length)
if (warnings.length) {
  console.log(`\n경고 ${warnings.length}건:`)
  for (const w of warnings) console.log(' -', w)
} else {
  console.log('\n경고 없음.')
}
