#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260531_170648_patients;
mod m20260531_170705_clinicians;
mod m20260531_170721_medical_operation_notes;
mod m20260531_170923_medical_operation_note_team_members;
mod m20260531_170947_medical_operation_note_procedures;
mod m20260531_171006_medical_operation_note_steps;
mod m20260531_171036_medical_operation_note_implants;
mod m20260531_171056_medical_operation_note_drains;
mod m20260531_171117_medical_operation_note_specimens;
mod m20260531_171138_medical_operation_note_complications;
mod m20260531_171211_medical_operation_note_grades;
mod m20260531_171232_medical_operation_note_grade_rules;
mod m20260531_171255_medical_operation_note_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260531_170648_patients::Migration),
            Box::new(m20260531_170705_clinicians::Migration),
            Box::new(m20260531_170721_medical_operation_notes::Migration),
            Box::new(m20260531_170923_medical_operation_note_team_members::Migration),
            Box::new(m20260531_170947_medical_operation_note_procedures::Migration),
            Box::new(m20260531_171006_medical_operation_note_steps::Migration),
            Box::new(m20260531_171036_medical_operation_note_implants::Migration),
            Box::new(m20260531_171056_medical_operation_note_drains::Migration),
            Box::new(m20260531_171117_medical_operation_note_specimens::Migration),
            Box::new(m20260531_171138_medical_operation_note_complications::Migration),
            Box::new(m20260531_171211_medical_operation_note_grades::Migration),
            Box::new(m20260531_171232_medical_operation_note_grade_rules::Migration),
            Box::new(m20260531_171255_medical_operation_note_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
