import {defineField} from 'sanity'

// Shared between note and essay — both come from the same legacy admin.js
// "noteEditor" form and carry the same publishing-workflow metadata.
export const sharedPostFields = [
  defineField({
    name: 'legacyId',
    title: 'Legacy ID',
    type: 'string',
    readOnly: true,
    description: '기존 CMS의 원본 ID (예: n1, e1). 마이그레이션 추적용이며 값을 바꾸지 마세요.',
  }),
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    options: {source: 'title', maxLength: 96},
    validation: (Rule) => Rule.required(),
    description: '발행 후 절대 변경 금지',
  }),
  defineField({
    name: 'category',
    title: 'Category',
    type: 'string',
    description: '예: Field Note, Research Note, Strategy Note, Founding Note, AI Native EMR',
  }),
  defineField({
    name: 'excerpt',
    title: 'Excerpt',
    type: 'text',
    rows: 3,
    validation: (Rule) => Rule.max(200),
    description: '메타 설명과 OG 카드에 사용',
  }),
  defineField({
    name: 'status',
    title: 'Status',
    type: 'string',
    options: {list: ['draft', 'review', 'published', 'archived']},
    initialValue: 'draft',
  }),
  defineField({
    name: 'publishedAt',
    title: 'Published At',
    type: 'datetime',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'updatedAt',
    title: 'Updated At',
    type: 'datetime',
  }),
  defineField({
    name: 'seoTitle',
    title: 'SEO Title',
    type: 'string',
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO Description',
    type: 'text',
    rows: 2,
  }),
  defineField({
    name: 'coverImage',
    title: 'Cover Image',
    type: 'image',
    options: {hotspot: true},
  }),
  defineField({
    name: 'canonical',
    title: 'Canonical URL',
    type: 'url',
  }),
  defineField({
    name: 'ideaTags',
    title: 'Ideas · Tags',
    type: 'array',
    of: [{type: 'string'}],
    description: '연결된 Idea/Concept 제목 (기존 admin.js의 Ideas · Tags)',
  }),
  defineField({
    name: 'workTags',
    title: 'Work · Tags',
    type: 'array',
    of: [{type: 'string'}],
    description: '연결된 Project 제목 (기존 admin.js의 Work · Tags)',
  }),
  defineField({
    name: 'researchTags',
    title: 'Research · Tags',
    type: 'array',
    of: [{type: 'string'}],
    description: '연결된 Research Question (기존 admin.js의 Research · Tags)',
  }),
  defineField({
    name: 'language',
    title: 'Language',
    type: 'string',
    options: {
      list: [
        {title: '한국어', value: 'ko'},
        {title: 'English', value: 'en'},
      ],
      layout: 'radio',
    },
    initialValue: 'ko',
  }),
]
