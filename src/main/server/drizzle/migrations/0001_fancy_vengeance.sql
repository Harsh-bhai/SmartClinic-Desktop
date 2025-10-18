CREATE TABLE `medicine_inventory` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text,
	`strength` text,
	`manufacturer` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `prescribed_medicines` (
	`id` text PRIMARY KEY NOT NULL,
	`prescription_id` text NOT NULL,
	`medicine_id` text,
	`name` text NOT NULL,
	`dose` text NOT NULL,
	`frequency` blob NOT NULL,
	`duration` text NOT NULL,
	`timing` text NOT NULL,
	`remarks` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`prescription_id`) REFERENCES `prescription`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`medicine_id`) REFERENCES `medicine_inventory`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `prescription` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`reason` text NOT NULL,
	`examination_findings` text NOT NULL,
	`advice` text NOT NULL,
	`next_visit` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `medicines`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_patients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`gender` text NOT NULL,
	`phone` text NOT NULL,
	`address` text NOT NULL,
	`paid_status` integer DEFAULT 0 NOT NULL,
	`paid` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_patients`("id", "name", "age", "gender", "phone", "address", "paid_status", "paid", "created_at", "updated_at") SELECT "id", "name", "age", "gender", "phone", "address", "paid_status", "paid", "created_at", "updated_at" FROM `patients`;--> statement-breakpoint
DROP TABLE `patients`;--> statement-breakpoint
ALTER TABLE `__new_patients` RENAME TO `patients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;