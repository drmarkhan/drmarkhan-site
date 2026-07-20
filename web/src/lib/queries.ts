import {sanity} from './sanity'

export async function getSiteSettings() {
  return sanity.fetch(`*[_id=="siteSettings"][0]`)
}

export async function getPublishedNotes() {
  return sanity.fetch(
    `*[_type=="note" && status=="published"]|order(publishedAt desc){
      _id, legacyId, title, "slug": slug.current, category, excerpt, publishedAt,
      ideaTags, workTags, researchTags
    }`,
  )
}

export async function getPublishedEssays() {
  return sanity.fetch(
    `*[_type=="essay" && status=="published"]|order(publishedAt desc){
      _id, legacyId, title, "slug": slug.current, category, excerpt, publishedAt,
      body, ideaTags, workTags, researchTags, featured
    }`,
  )
}

export async function getArticleBySlug(slug: string) {
  return sanity.fetch(
    `*[(_type=="note" || _type=="essay") && slug.current==$slug][0]{
      ...,
      "slug": slug.current
    }`,
    {slug},
  )
}

export async function getConcepts() {
  return sanity.fetch(`*[_type=="concept"]|order(code asc){_id, code, stage, title, description}`)
}

export async function getProjects() {
  return sanity.fetch(`*[_type=="project"]|order(legacyId asc){_id, legacyId, status, area, title, subtitle, problem, approach, next}`)
}

export async function getResearchQuestions() {
  return sanity.fetch(`*[_type=="researchQuestion"]|order(legacyId asc){_id, legacyId, stage, percent, question, hypothesis, method}`)
}
