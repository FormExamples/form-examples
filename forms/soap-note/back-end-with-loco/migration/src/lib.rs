#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_212647_patients;
mod m20260702_212711_clinicians;
mod m20260702_212737_soap_notes;
mod m20260702_212803_soap_note_grades;
mod m20260702_212828_soap_note_grade_rules;
mod m20260702_212854_soap_note_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_212647_patients::Migration),
            Box::new(m20260702_212711_clinicians::Migration),
            Box::new(m20260702_212737_soap_notes::Migration),
            Box::new(m20260702_212803_soap_note_grades::Migration),
            Box::new(m20260702_212828_soap_note_grade_rules::Migration),
            Box::new(m20260702_212854_soap_note_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
