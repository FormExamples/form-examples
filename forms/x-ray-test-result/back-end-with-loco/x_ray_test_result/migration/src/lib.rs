#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260630_164304_patients;
mod m20260630_164320_clinicians;
mod m20260630_164337_x_ray_test_results;
mod m20260630_164354_x_ray_test_result_grades;
mod m20260630_164412_x_ray_test_result_grade_rules;
mod m20260630_164430_x_ray_test_result_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260630_164304_patients::Migration),
            Box::new(m20260630_164320_clinicians::Migration),
            Box::new(m20260630_164337_x_ray_test_results::Migration),
            Box::new(m20260630_164354_x_ray_test_result_grades::Migration),
            Box::new(m20260630_164412_x_ray_test_result_grade_rules::Migration),
            Box::new(m20260630_164430_x_ray_test_result_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}