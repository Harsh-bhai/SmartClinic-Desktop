PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_prescribed_medicines` (
	`id` text PRIMARY KEY NOT NULL,
	`prescription_id` text NOT NULL,
	`medicine_id` text,
	`name` text NOT NULL,
	`dose` text NOT NULL,
	`frequency` blob NOT NULL,
	`duration` text NOT NULL,
	`timing` text,
	`remarks` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`prescription_id`) REFERENCES `prescription`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`medicine_id`) REFERENCES `medicine_inventory`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_prescribed_medicines`("id", "prescription_id", "medicine_id", "name", "dose", "frequency", "duration", "timing", "remarks", "created_at", "updated_at") SELECT "id", "prescription_id", "medicine_id", "name", "dose", "frequency", "duration", "timing", "remarks", "created_at", "updated_at" FROM `prescribed_medicines`;--> statement-breakpoint
DROP TABLE `prescribed_medicines`;--> statement-breakpoint
ALTER TABLE `__new_prescribed_medicines` RENAME TO `prescribed_medicines`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `medicine_inventory` ADD `expected_dose` text;--> statement-breakpoint
ALTER TABLE `medicine_inventory` ADD `related_disease` text;--> statement-breakpoint
ALTER TABLE `medicine_inventory` DROP COLUMN `strength`;