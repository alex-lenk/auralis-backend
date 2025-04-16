ALTER TABLE "anonymous_users" DROP CONSTRAINT "anonymous_users_fingerprint_unique";--> statement-breakpoint
ALTER TABLE "anonymous_users" ALTER COLUMN "fingerprint" SET DATA TYPE varchar(60);--> statement-breakpoint
ALTER TABLE "anonymous_users" ALTER COLUMN "fingerprint" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_users" ADD COLUMN "device_id" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_users" ADD CONSTRAINT "anonymous_users_device_id_unique" UNIQUE("device_id");