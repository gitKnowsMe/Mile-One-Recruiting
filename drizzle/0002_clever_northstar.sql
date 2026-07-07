ALTER TABLE "applications" DROP CONSTRAINT "cdl_documents_required_when_current_cdl";--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "cdl_photo_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "medical_card_photo_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "current_cdl";