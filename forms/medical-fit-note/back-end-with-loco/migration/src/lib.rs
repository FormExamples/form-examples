#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20261028_182951_employees;
mod m20261028_183009_clinicians;
mod m20261028_183025_medical_fit_notes;
mod m20261028_183041_medical_fit_note_grades;
mod m20261028_183058_medical_fit_note_grade_rules;
mod m20261028_183116_medical_fit_note_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20261028_182951_employees::Migration),
            Box::new(m20261028_183009_clinicians::Migration),
            Box::new(m20261028_183025_medical_fit_notes::Migration),
            Box::new(m20261028_183041_medical_fit_note_grades::Migration),
            Box::new(m20261028_183058_medical_fit_note_grade_rules::Migration),
            Box::new(m20261028_183116_medical_fit_note_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
