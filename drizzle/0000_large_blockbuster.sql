CREATE TABLE "anonymous_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"fingerprint" text NOT NULL,
	"user_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "anonymous_users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "anonymous_users_fingerprint_unique" UNIQUE("fingerprint")
);
