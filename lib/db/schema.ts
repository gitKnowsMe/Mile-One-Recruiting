import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  yearsExperience: text('years_experience').notNull(),
  trailerType: text('trailer_type').notNull(),
  // Every applicant must hold a valid CDL to drive commercially, so both
  // documents are always required — no conditional logic needed here.
  cdlPhotoUrl: text('cdl_photo_url').notNull(),
  medicalCardPhotoUrl: text('medical_card_photo_url').notNull(),
  // Nullable for now — the consent flow is being wired into the application
  // code first; a follow-up migration will make this NOT NULL once it's
  // confirmed live in production (same pattern used for the photo URL
  // columns above).
  drivingRecordDisclosureAgreedAt: timestamp('driving_record_disclosure_agreed_at', {
    withTimezone: true,
  }),
  isWaitlist: boolean('is_waitlist').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Application = typeof applications.$inferSelect
export type NewApplication = typeof applications.$inferInsert
