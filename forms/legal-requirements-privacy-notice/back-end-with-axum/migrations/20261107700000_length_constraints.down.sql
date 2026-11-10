ALTER TABLE "clinicians" DROP CONSTRAINT IF EXISTS "clinicians_united_kingdom_nhs_number_length";
ALTER TABLE "clinicians" DROP CONSTRAINT IF EXISTS "clinicians_country_as_iso_3166_1_alpha_2_length";
ALTER TABLE "patients" DROP CONSTRAINT IF EXISTS "patients_united_kingdom_nhs_number_length";
ALTER TABLE "patients" DROP CONSTRAINT IF EXISTS "patients_country_as_iso_3166_1_alpha_2_length";
ALTER TABLE "patients" DROP CONSTRAINT IF EXISTS "patients_name_length";
