import {defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Work / Project',
  type: 'document',
  fields: [
    defineField({
      name: 'legacyId',
      title: 'Legacy ID',
      type: 'string',
      readOnly: true,
      description: '기존 CMS의 원본 ID (예: p1). 마이그레이션 추적용이며 값을 바꾸지 마세요.',
    }),
    defineField({name: 'status', title: 'Status', type: 'string'}),
    defineField({name: 'area', title: 'Area', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({
      name: 'problem',
      title: 'Problem',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'approach',
      title: 'Approach',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'next',
      title: 'Next',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'status'}},
})
