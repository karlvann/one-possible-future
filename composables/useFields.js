export const useFields = () => {
  return [
    '*',

    'image.id', 'image.filename_download', 'image.description', 'image.width', 'image.height',

    'categories.article_categories_id.slug', 'categories.article_categories_id.title', 'categories.article_categories_id.image.*',

    'hero.*', 
    'hero.cta.*',
    'hero.cta.cta_id.*',

    'hero.image.id', 'hero.image.filename_download', 'hero.image.description', 'hero.image.width', 'hero.image.height',
    'hero.thumbnail.id', 'hero.thumbnail.filename_download', 'hero.thumbnail.description', 'hero.thumbnail.width', 'hero.thumbnail.height',

    'blocks.collection',

    'blocks.item.*',

    'blocks.item.cta.*',

    'blocks.item.table.*',

    'blocks.item.table.table_row_id.*',

    'blocks.item.usps.usp_id.*',

    'blocks.item.steps.step_id.*',

    'blocks.item.steps.step_id.image.id', 'blocks.item.steps.step_id.image.filename_download', 'blocks.item.steps.step_id.image.description', 'blocks.item.steps.step_id.image.width', 'blocks.item.steps.step_id.image.height',

    'blocks.item.reviews.review_id.*',

    'blocks.item.avatar.id', 'blocks.item.avatar.filename_download', 'blocks.item.avatar.description', 'blocks.item.avatar.width', 'blocks.item.avatar.height',

    'blocks.item.image.id', 'blocks.item.image.filename_download', 'blocks.item.image.description', 'blocks.item.image.width', 'blocks.item.image.height',

    'blocks.item.thumbnail.id', 'blocks.item.thumbnail.filename_download', 'blocks.item.thumbnail.description', 'blocks.item.thumbnail.width', 'blocks.item.thumbnail.height',

    'blocks.item.faqs.*', 'blocks.item.faqs.faq_id.q', 'blocks.item.faqs.faq_id.a',
    
    'blocks.item.features.feature_id.*', 'blocks.item.features.feature_id.image.id', 'blocks.item.features.feature_id.image.filename_download', 'blocks.item.features.feature_id.image.description', 'blocks.item.features.feature_id.image.width', 'blocks.item.features.feature_id.image.height',

    'seo.meta_title', 'seo.meta_description', 'seo.meta_image.id', 'seo.meta_image.filename_download'

  ]
}