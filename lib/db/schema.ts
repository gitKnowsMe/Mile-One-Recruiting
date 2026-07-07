import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  yearsExperience: text('years_experience').notNull(),
  trailerType: text('trailer_type').notNull(),
  currentCdl: boolean('current_cdl').notNull().default(false),
  cdlPhotoUrl: text('cdl_photo_url'),
  medicalCardPhotoUrl: text('medical_card_photo_url'),
  isWaitlist: boolean('is_waitlist').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Application = typeof applications.$inferSelect
export type NewApplication = typeof applications.$inferInsert
