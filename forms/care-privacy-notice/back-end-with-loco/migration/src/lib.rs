#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_030721_patients;
mod m20260701_030755_clinicians;
mod m20260701_030837_assessments;
mod m20260701_030954_grades;
mod m20260701_031026_grading_fired_rules;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_030721_patients::Migration),
            Box::new(m20260701_030755_clinicians::Migration),
            Box::new(m20260701_030837_assessments::Migration),
            Box::new(m20260701_030954_grades::Migration),
            Box::new(m20260701_031026_grading_fired_rules::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}