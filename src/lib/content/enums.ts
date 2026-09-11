/**
 * Única fuente de verdad para los valores de estado que en el schema
 * de Prisma se guardan como String (no enum nativo, para que el schema
 * de producción MySQL y el de desarrollo SQLite sean idénticos —
 * ver docs/DATABASE.md). Todo el código de la app debe importar estas
 * constantes en lugar de escribir los strings a mano.
 */

export const ARTICLE_STATUS = [
  'draft',
  'review',
  'scheduled',
  'published',
  'updated',
  'archived',
] as const
export type ArticleStatus = (typeof ARTICLE_STATUS)[number]

export const NEWS_CANDIDATE_STATUS = [
  'new',
  'reviewing',
  'approved',
  'rejected',
  'duplicate',
  'published',
] as const
export type NewsCandidateStatus = (typeof NEWS_CANDIDATE_STATUS)[number]

export const EDITORIAL_ACTION = [
  'auto_publish_safe',
  'requires_review',
  'do_not_publish',
] as const
export type EditorialAction = (typeof EDITORIAL_ACTION)[number]

export const TRANSFER_STATUS = ['confirmed', 'rumor'] as const
export type TransferStatus = (typeof TRANSFER_STATUS)[number]

export const CRON_STATUS = ['running', 'success', 'error', 'skipped'] as const
export type CronStatus = (typeof CRON_STATUS)[number]

export const RACE_CATEGORY = [
  'grand-tour',
  'classic',
  'worldtour',
  'women-worldtour',
  'national',
  'other',
] as const
export type RaceCategory = (typeof RACE_CATEGORY)[number]

export const TEAM_CATEGORY = [
  'worldtour',
  'proteam',
  'women-worldtour',
  'continental',
  'national',
] as const
export type TeamCategory = (typeof TEAM_CATEGORY)[number]

export const TAG_TYPE = ['rider', 'team', 'race', 'generic', 'topic'] as const
export type TagType = (typeof TAG_TYPE)[number]

export const SOURCE_CREDIBILITY_TIER = [
  'official',
  'team',
  'uci',
  'agency',
  'media',
  'journalist',
  'other',
] as const
export type SourceCredibilityTier = (typeof SOURCE_CREDIBILITY_TIER)[number]
