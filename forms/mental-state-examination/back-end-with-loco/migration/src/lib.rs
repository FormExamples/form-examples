#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_181146_patients;
mod m20260702_181210_clinicians;
mod m20260702_181256_mental_state_examinations;
mod m20260702_181323_mental_state_examination_grades;
mod m20260702_181345_mental_state_examination_grade_rules;
mod m20260702_181407_mental_state_examination_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_181146_patients::Migration),
            Box::new(m20260702_181210_clinicians::Migration),
            Box::new(m20260702_181256_mental_state_examinations::Migration),
            Box::new(m20260702_181323_mental_state_examination_grades::Migration),
            Box::new(m20260702_181345_mental_state_examination_grade_rules::Migration),
            Box::new(m20260702_181407_mental_state_examination_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
