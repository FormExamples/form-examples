-- Name assessment_rom_measurements.range_of_motion_id as sql/ does.
ALTER TABLE "assessment_rom_measurements" RENAME COLUMN "assessment_range_of_motion_id" TO "range_of_motion_id";
ALTER TABLE "assessment_rom_measurements" RENAME CONSTRAINT "fk-assessment_rom_measurements-assessment_range_of_motion_id-to-assessment_range_of_motions" TO "fk-assessment_rom_measurements-range_of_motion_id-to-assessment_range_of_motions";
