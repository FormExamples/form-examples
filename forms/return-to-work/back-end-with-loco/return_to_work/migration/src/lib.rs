#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_052745_patients;
mod m20260701_052819_clinicians;
mod m20260701_052838_employers;
mod m20260701_052858_return_to_works;
mod m20260701_052919_return_to_work_restrictions;
mod m20260701_052942_return_to_work_grades;
mod m20260701_053014_return_to_work_grade_rules;
mod m20260701_053037_return_to_work_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_052745_patients::Migration),
            Box::new(m20260701_052819_clinicians::Migration),
            Box::new(m20260701_052838_employers::Migration),
            Box::new(m20260701_052858_return_to_works::Migration),
            Box::new(m20260701_052919_return_to_work_restrictions::Migration),
            Box::new(m20260701_052942_return_to_work_grades::Migration),
            Box::new(m20260701_053014_return_to_work_grade_rules::Migration),
            Box::new(m20260701_053037_return_to_work_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}