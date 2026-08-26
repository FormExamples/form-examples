#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260814_181049_patients;
mod m20260814_181122_assessors;
mod m20260814_181156_health_screening_questionnaires;
mod m20260814_181225_health_screening_questionnaire_grades;
mod m20260814_181255_health_screening_questionnaire_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260814_181049_patients::Migration),
            Box::new(m20260814_181122_assessors::Migration),
            Box::new(m20260814_181156_health_screening_questionnaires::Migration),
            Box::new(m20260814_181225_health_screening_questionnaire_grades::Migration),
            Box::new(m20260814_181255_health_screening_questionnaire_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
