import {defineField, defineType} from 'sanity'
import {sharedPostFields} from './postFields'

export const essay = defineType({
  name: 'essay',
  title: 'Essay',
  type: 'document',
  fields: [
    ...sharedPostFields,
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: '홈 고정 대표 에세이로 표시',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Published, New to Old',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'category'},
  },
})
