-- The sql/ columns the scaffold left out, with their CHECKs.
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD COLUMN "qualifications" text DEFAULT '' NOT NULL;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD COLUMN "attendance_mode" varchar DEFAULT '' NOT NULL;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD COLUMN "ethnicity" text DEFAULT '' NOT NULL;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD COLUMN "pregnancy_status" varchar DEFAULT '' NOT NULL;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD COLUMN "implanted_device_status" varchar DEFAULT '' NOT NULL;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD COLUMN "implanted_devices" text DEFAULT '' NOT NULL;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD COLUMN "cause_id_condition" text DEFAULT '' NOT NULL;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD COLUMN "cause_id_interval" text DEFAULT '' NOT NULL;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD COLUMN "bereaved_family_discussed" varchar DEFAULT '' NOT NULL;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD CONSTRAINT "medical_certificate_of_cause_of_deaths_attendance_mode_check" CHECK (attendance_mode IN ('in-person', 'video', 'telephone', 'none', '')) NOT VALID;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD CONSTRAINT "medical_certificate_of_cause_of_deaths_pregnancy_status_check" CHECK (pregnancy_status IN ('not-applicable', 'not-pregnant', 'pregnant-at-death', 'pregnant-within-12-months', 'unknown', '')) NOT VALID;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD CONSTRAINT "medical_certificate_of_cause_of_deaths_implanted_devic_becfcd14" CHECK (implanted_device_status IN ('none', 'present', 'unknown', '')) NOT VALID;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD CONSTRAINT "medical_certificate_of_cause_of_deaths_bereaved_family_591ded4a" CHECK (bereaved_family_discussed IN ('yes', 'no', '')) NOT VALID;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD CONSTRAINT "medical_certificate_of_cause_of_deaths_attendance_mode_length" CHECK (char_length("attendance_mode") <= 10) NOT VALID;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD CONSTRAINT "medical_certificate_of_cause_of_deaths_pregnancy_status_length" CHECK (char_length("pregnancy_status") <= 30) NOT VALID;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD CONSTRAINT "medical_certificate_of_cause_of_deaths_implanted_devic_31411e52" CHECK (char_length("implanted_device_status") <= 10) NOT VALID;
ALTER TABLE "medical_certificate_of_cause_of_deaths" ADD CONSTRAINT "medical_certificate_of_cause_of_deaths_bereaved_family_f324da9a" CHECK (char_length("bereaved_family_discussed") <= 5) NOT VALID;
