import {createClient} from '@sanity/client'

export const sanity = createClient({
  projectId: 'qspgm6e7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  // This client is only ever used at build time (Astro SSG), never in the
  // browser, so there's no request-volume reason to use the CDN — and the
  // CDN can lag ~30-60s behind a fresh publish, which caused build failures
  // when the Sanity webhook triggered a Vercel build immediately on publish.
  useCdn: false,
})
