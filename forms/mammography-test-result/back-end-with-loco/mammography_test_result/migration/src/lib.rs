#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_042420_patients;
mod m20260701_042442_clinicians;
mod m20260701_042518_mammography_test_results;
mod m20260701_042541_mammography_test_result_grades;
mod m20260701_042604_mammography_test_result_grade_rules;
mod m20260701_042624_mammography_test_result_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_042420_patients::Migration),
            Box::new(m20260701_042442_clinicians::Migration),
            Box::new(m20260701_042518_mammography_test_results::Migration),
            Box::new(m20260701_042541_mammography_test_result_grades::Migration),
            Box::new(m20260701_042604_mammography_test_result_grade_rules::Migration),
            Box::new(m20260701_042624_mammography_test_result_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}