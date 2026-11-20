-- The sql/ columns the scaffold left out, with their CHECKs.
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP CONSTRAINT IF EXISTS "medical_certificate_of_cause_of_deaths_bereaved_family_f324da9a";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP CONSTRAINT IF EXISTS "medical_certificate_of_cause_of_deaths_implanted_devic_31411e52";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP CONSTRAINT IF EXISTS "medical_certificate_of_cause_of_deaths_pregnancy_status_length";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP CONSTRAINT IF EXISTS "medical_certificate_of_cause_of_deaths_attendance_mode_length";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP CONSTRAINT IF EXISTS "medical_certificate_of_cause_of_deaths_bereaved_family_591ded4a";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP CONSTRAINT IF EXISTS "medical_certificate_of_cause_of_deaths_implanted_devic_becfcd14";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP CONSTRAINT IF EXISTS "medical_certificate_of_cause_of_deaths_pregnancy_status_check";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP CONSTRAINT IF EXISTS "medical_certificate_of_cause_of_deaths_attendance_mode_check";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP COLUMN "bereaved_family_discussed";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP COLUMN "cause_id_interval";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP COLUMN "cause_id_condition";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP COLUMN "implanted_devices";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP COLUMN "implanted_device_status";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP COLUMN "pregnancy_status";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP COLUMN "ethnicity";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP COLUMN "attendance_mode";
ALTER TABLE "medical_certificate_of_cause_of_deaths" DROP COLUMN "qualifications";
