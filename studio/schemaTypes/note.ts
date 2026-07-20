import {defineType} from 'sanity'
import {sharedPostFields} from './postFields'

export const note = defineType({
  name: 'note',
  title: 'Field Note',
  type: 'document',
  fields: sharedPostFields,
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
