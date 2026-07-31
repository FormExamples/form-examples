#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260731170001_patients;
mod m20260731170002_clinicians;
mod m20260731170003_inpatient_clinical_notes;
mod m20260731170004_inpatient_clinical_note_problems;
mod m20260731170005_inpatient_clinical_note_medication_changes;
mod m20260731170006_inpatient_clinical_note_investigations;
mod m20260731170007_inpatient_clinical_note_jobs;
mod m20260731170008_inpatient_clinical_note_grades;
mod m20260731170009_inpatient_clinical_note_grade_rules;
mod m20260731170010_inpatient_clinical_note_grade_flags;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260731170001_patients::Migration),
            Box::new(m20260731170002_clinicians::Migration),
            Box::new(m20260731170003_inpatient_clinical_notes::Migration),
            Box::new(m20260731170004_inpatient_clinical_note_problems::Migration),
            Box::new(m20260731170005_inpatient_clinical_note_medication_changes::Migration),
            Box::new(m20260731170006_inpatient_clinical_note_investigations::Migration),
            Box::new(m20260731170007_inpatient_clinical_note_jobs::Migration),
            Box::new(m20260731170008_inpatient_clinical_note_grades::Migration),
            Box::new(m20260731170009_inpatient_clinical_note_grade_rules::Migration),
            Box::new(m20260731170010_inpatient_clinical_note_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}