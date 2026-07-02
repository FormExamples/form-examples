#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_223238_patients;
mod m20260702_223255_clinicians;
mod m20260702_223313_rockall_score_for_upper_gastrointestinal_bleedings;
mod m20260702_223331_rockall_score_for_upper_gastrointestinal_bleeding_grades;
mod m20260702_223349_rockall_score_for_upper_gastrointestinal_bleeding_grade_rules;
mod m20260702_223408_rockall_score_for_upper_gastrointestinal_bleeding_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_223238_patients::Migration),
            Box::new(m20260702_223255_clinicians::Migration),
            Box::new(m20260702_223313_rockall_score_for_upper_gastrointestinal_bleedings::Migration),
            Box::new(m20260702_223331_rockall_score_for_upper_gastrointestinal_bleeding_grades::Migration),
            Box::new(m20260702_223349_rockall_score_for_upper_gastrointestinal_bleeding_grade_rules::Migration),
            Box::new(m20260702_223408_rockall_score_for_upper_gastrointestinal_bleeding_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}