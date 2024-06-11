CREATE TABLE IF NOT EXISTS "integrations" (
	"username" varchar PRIMARY KEY NOT NULL,
	"password" varchar,
	"is_active" boolean DEFAULT true
);
