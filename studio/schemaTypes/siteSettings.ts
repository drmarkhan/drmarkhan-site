import {defineField, defineType} from 'sanity'

// Short single-line UI copy (nav items, button labels, filter labels).
const shortText = (name: string, title: string) => defineField({name, title, type: 'string'})

// Longer copy that may span a sentence or two (hero title, intro, footer lines).
// Kept as plain text (not Portable Text) — this is UI chrome edited rarely, not
// long-form content, so rich-text editing would be overkill here.
const longText = (name: string, title: string) => defineField({name, title, type: 'text', rows: 2})

// Shared shape for the journal/framework/projects/research/about page headers.
const pageCopyFields = [longText('overline', 'Overline'), longText('title', 'Title'), longText('description', 'Description')]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'meta',
      title: 'Meta',
      type: 'object',
      fields: [
        shortText('title', 'Browser Title'),
        longText('description', 'Search/Share Description'),
        shortText('language', 'Language'),
      ],
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'object',
      fields: [shortText('name', 'Display Name'), shortText('subject', 'Subject')],
    }),
    defineField({
      name: 'nav',
      title: 'Navigation',
      type: 'object',
      fields: [
        'home',
        'journal',
        'framework',
        'projects',
        'research',
        'about',
        'edit',
        'menu',
        'close',
        'editContent',
      ].map((key) => shortText(key, key)),
    }),
    defineField({
      name: 'home',
      title: 'Home',
      type: 'object',
      fields: [
        shortText('overline', 'Overline'),
        longText('title', 'Title'),
        longText('thesis', 'Thesis'),
        longText('intro', 'Intro'),
        shortText('primaryButton', 'Primary Button'),
        shortText('secondaryButton', 'Secondary Button'),
        shortText('currentLabel', 'Current Label'),
        longText('currentTitle', 'Current Title'),
        longText('currentText', 'Current Text'),
        shortText('featuredLabel', 'Featured Label'),
        shortText('latestLabel', 'Latest Label'),
        shortText('allWriting', 'All Writing Link Text'),
        shortText('centralLabel', 'Central Label'),
        longText('centralQuestion', 'Central Question'),
        longText('centralText', 'Central Text'),
        shortText('themesLabel', 'Themes Label'),
        shortText('notesLabel', 'Notes Label'),
        longText('notesTitle', 'Notes Title'),
        longText('notesText', 'Notes Text'),
        shortText('timelineLabel', 'Timeline Label'),
        longText('closing', 'Closing Line'),
      ],
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'timelineItem',
          fields: [shortText('year', 'Year'), shortText('description', 'Description')],
          preview: {select: {title: 'year', subtitle: 'description'}},
        },
      ],
    }),
    defineField({
      name: 'pages',
      title: 'Section Pages',
      type: 'object',
      fields: [
        defineField({
          name: 'journal',
          title: 'Journal (Writing)',
          type: 'object',
          fields: [
            ...pageCopyFields,
            shortText('search', 'Search Placeholder'),
            shortText('all', 'All Filter'),
            shortText('essays', 'Essays Filter'),
            shortText('notes', 'Notes Filter'),
          ],
        }),
        defineField({name: 'framework', title: 'Framework (Ideas)', type: 'object', fields: pageCopyFields}),
        defineField({name: 'projects', title: 'Projects (Work)', type: 'object', fields: pageCopyFields}),
        defineField({name: 'research', title: 'Research', type: 'object', fields: pageCopyFields}),
        defineField({name: 'about', title: 'About', type: 'object', fields: pageCopyFields}),
      ],
    }),
    defineField({
      name: 'about',
      title: 'About Content',
      type: 'object',
      fields: [
        defineField({
          name: 'paragraphs',
          title: 'Paragraphs',
          type: 'array',
          of: [{type: 'text', rows: 3}],
        }),
        defineField({
          name: 'facts',
          title: 'Facts',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'fact',
              fields: [shortText('label', 'Label'), longText('value', 'Value')],
              preview: {select: {title: 'label', subtitle: 'value'}},
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'labels',
      title: 'UI Labels',
      type: 'object',
      fields: [
        'readEssay',
        'essay',
        'note',
        'read',
        'problem',
        'approach',
        'next',
        'hypothesis',
        'method',
        'connections',
        'developingNote',
        'close',
      ].map((key) => shortText(key, key)),
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        longText('line1', 'Line 1'),
        longText('line2', 'Line 2'),
        shortText('copyright', 'Copyright'),
        shortText('edit', 'Edit Link Text'),
      ],
    }),
  ],
  preview: {
    select: {title: 'brand.name'},
    prepare: ({title}) => ({title: title || 'Site Settings'}),
  },
})
