CREATE TABLE IF NOT EXISTS "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"photo" varchar(256),
	"author" varchar(128) DEFAULT 'Namia Editorial Team',
	"category" varchar(64) DEFAULT 'Edu-Fintech',
	"published_at" timestamp DEFAULT now()
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faq_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"is_investor" integer DEFAULT 0
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"question" varchar(512) NOT NULL,
	"answer" text NOT NULL
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personil" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(128) NOT NULL,
	"job_level" integer NOT NULL,
	"job_title" varchar(128) NOT NULL,
	"biography" text NOT NULL,
	"photo" varchar(256),
	"department" varchar(64)
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(64) NOT NULL,
	"amount" varchar(32) NOT NULL,
	"unit" varchar(16),
	"icon" varchar(64)
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(128) NOT NULL,
	"email" varchar(128) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"nik" varchar(16),
	"date_of_birth" varchar(32),
	"address" text,
	"employment_type" varchar(64),
	"monthly_income" numeric,
	"need_category" varchar(64),
	"target_amount" numeric,
	"target_tenor_months" integer,
	"kyc_step" integer DEFAULT 1,
	"status" varchar(32) DEFAULT 'pending',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(64) NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"icon" varchar(64),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" varchar(128) NOT NULL,
	"provider" varchar(128) NOT NULL,
	"logo" varchar(256),
	"description" text NOT NULL,
	"min_amount" numeric NOT NULL,
	"max_amount" numeric NOT NULL,
	"min_tenor_months" integer NOT NULL,
	"max_tenor_months" integer NOT NULL,
	"interest_rate_annual" numeric NOT NULL,
	"admin_fee" numeric DEFAULT '0',
	"rating" numeric DEFAULT '4.5',
	"sharia_accredited" boolean DEFAULT true,
	"contract_type" varchar(64),
	"features" text,
	"apply_url" varchar(256),
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);

--> statement-breakpoint
DO $ $ BEGIN
ALTER TABLE
	"faqs"
ADD
	CONSTRAINT "faqs_category_id_faq_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."faq_categories"("id") ON DELETE no action ON UPDATE no action;

EXCEPTION
WHEN duplicate_object THEN null;

END $ $;

--> statement-breakpoint
DO $ $ BEGIN
ALTER TABLE
	"products"
ADD
	CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;

EXCEPTION
WHEN duplicate_object THEN null;

END $ $;