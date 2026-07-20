import {defineField, defineType} from 'sanity'

export const concept = defineType({
  name: 'concept',
  title: 'Idea / Concept',
  type: 'document',
  fields: [
    defineField({
      name: 'legacyId',
      title: 'Legacy ID',
      type: 'string',
      readOnly: true,
      description: '기존 CMS의 원본 코드 (예: 01). 마이그레이션 추적용이며 값을 바꾸지 마세요.',
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      description: '예: 01, 02',
    }),
    defineField({
      name: 'stage',
      title: 'Stage',
      type: 'string',
      description: '예: Core, Developing, Exploring, Research Agenda',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
  ],
  orderings: [{title: 'Code', name: 'codeAsc', by: [{field: 'code', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'stage'}},
})
