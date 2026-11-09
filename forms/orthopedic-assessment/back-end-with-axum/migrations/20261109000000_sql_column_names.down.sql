-- Name assessment_rom_measurements.range_of_motion_id as sql/ does.
ALTER TABLE "assessment_rom_measurements" RENAME CONSTRAINT "fk-assessment_rom_measurements-range_of_motion_id-to-assessment_range_of_motions" TO "fk-assessment_rom_measurements-assessment_range_of_motion_id-to-assessment_range_of_motions";
ALTER TABLE "assessment_rom_measurements" RENAME COLUMN "range_of_motion_id" TO "assessment_range_of_motion_id";
