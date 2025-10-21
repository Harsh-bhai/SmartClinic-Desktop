PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_patients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`gender` text NOT NULL,
	`paid_status` integer DEFAULT 0 NOT NULL,
	`paid` integer DEFAULT 0 NOT NULL,
	`phone` text,
	`address` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_patients`("id", "name", "age", "gender", "paid_status", "paid", "phone", "address", "created_at", "updated_at") SELECT "id", "name", "age", "gender", "paid_status", "paid", "phone", "address", "created_at", "updated_at" FROM `patients`;--> statement-breakpoint
DROP TABLE `patients`;--> statement-breakpoint
ALTER TABLE `__new_patients` RENAME TO `patients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;