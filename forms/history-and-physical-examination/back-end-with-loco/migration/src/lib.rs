#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_212640_patients;
mod m20260702_212701_clinicians;
mod m20260702_212730_history_and_physical_examinations;
mod m20260702_212802_history_and_physical_examination_grades;
mod m20260702_212827_history_and_physical_examination_grade_rules;
mod m20260702_212852_history_and_physical_examination_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_212640_patients::Migration),
            Box::new(m20260702_212701_clinicians::Migration),
            Box::new(m20260702_212730_history_and_physical_examinations::Migration),
            Box::new(m20260702_212802_history_and_physical_examination_grades::Migration),
            Box::new(m20260702_212827_history_and_physical_examination_grade_rules::Migration),
            Box::new(m20260702_212852_history_and_physical_examination_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}