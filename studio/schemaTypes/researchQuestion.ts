import {defineField, defineType} from 'sanity'

export const researchQuestion = defineType({
  name: 'researchQuestion',
  title: 'Research Question',
  type: 'document',
  fields: [
    defineField({
      name: 'legacyId',
      title: 'Legacy ID',
      type: 'string',
      readOnly: true,
      description: '기존 CMS의 원본 ID (예: r1). 마이그레이션 추적용이며 값을 바꾸지 마세요.',
    }),
    defineField({name: 'stage', title: 'Stage', type: 'string'}),
    defineField({
      name: 'percent',
      title: 'Progress %',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hypothesis',
      title: 'Hypothesis',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'method',
      title: 'Method',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
  ],
  preview: {select: {title: 'question', subtitle: 'stage'}},
})
