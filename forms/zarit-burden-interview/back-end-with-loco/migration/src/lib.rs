#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_204244_patients;
mod m20260702_204317_clinicians;
mod m20260702_204455_zarit_burden_interviews;
mod m20260702_204520_zarit_burden_interview_grades;
mod m20260702_204542_zarit_burden_interview_grade_rules;
mod m20260702_204609_zarit_burden_interview_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_204244_patients::Migration),
            Box::new(m20260702_204317_clinicians::Migration),
            Box::new(m20260702_204455_zarit_burden_interviews::Migration),
            Box::new(m20260702_204520_zarit_burden_interview_grades::Migration),
            Box::new(m20260702_204542_zarit_burden_interview_grade_rules::Migration),
            Box::new(m20260702_204609_zarit_burden_interview_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
