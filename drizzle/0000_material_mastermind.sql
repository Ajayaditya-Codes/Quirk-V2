CREATE TABLE "Logs" (
	"created_at" timestamp PRIMARY KEY DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"LogMessage" text NOT NULL,
	"WorkflowName" text NOT NULL,
	"Success" boolean
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"KindeID" text PRIMARY KEY NOT NULL,
	"Username" text NOT NULL,
	"Email" text NOT NULL,
	"Credits" integer NOT NULL,
	"SlackAccessToken" text,
	"AsanaRefreshToken" text,
	"Workflows" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	CONSTRAINT "Users_Email_unique" UNIQUE("Email")
);
--> statement-breakpoint
CREATE TABLE "Workflows" (
	"WorkflowName" text PRIMARY KEY NOT NULL,
	"GitHubNode" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"Nodes" jsonb[] DEFAULT ARRAY[]::jsonb[] NOT NULL,
	"Edges" jsonb[] DEFAULT ARRAY[]::jsonb[] NOT NULL,
	"Published" boolean DEFAULT false NOT NULL,
	"HookID" text
);
