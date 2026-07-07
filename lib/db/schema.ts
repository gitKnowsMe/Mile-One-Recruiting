import { sql } from 'drizzle-orm'
import { boolean, check, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const applications = pgTable(
  'applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    yearsExperience: text('years_experience').notNull(),
    trailerType: text('trailer_type').notNull(),
    currentCdl: boolean('current_cdl').notNull().default(false),
    // Nullable because these are only required when currentCdl is true (e.g.
    // "New Grad" applicants with no CDL yet legitimately have neither) — the
    // check constraint below enforces that conditional requirement in the DB,
    // mirroring the zod superRefine in lib/application-schema.ts.
    cdlPhotoUrl: text('cdl_photo_url'),
    medicalCardPhotoUrl: text('medical_card_photo_url'),
    isWaitlist: boolean('is_waitlist').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      'cdl_documents_required_when_current_cdl',
      sql`${table.currentCdl} = false OR (${table.cdlPhotoUrl} IS NOT NULL AND ${table.medicalCardPhotoUrl} IS NOT NULL)`
    ),
  ]
)

export type Application = typeof applications.$inferSelect
export type NewApplication = typeof applications.$inferInsert
