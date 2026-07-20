import {createClient} from '@sanity/client'

export const sanity = createClient({
  projectId: 'qspgm6e7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
