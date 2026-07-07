CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"years_experience" text NOT NULL,
	"trailer_type" text NOT NULL,
	"current_cdl" boolean DEFAULT false NOT NULL,
	"cdl_photo_url" text,
	"is_waitlist" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cdl_photo_required_when_current_cdl" CHECK ("applications"."current_cdl" = false OR "applications"."cdl_photo_url" IS NOT NULL)
);
