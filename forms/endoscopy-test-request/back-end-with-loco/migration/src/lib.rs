#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_062032_patients;
mod m20260701_062048_clinicians;
mod m20260701_062103_endoscopy_test_requests;
mod m20260701_062119_endoscopy_test_request_grades;
mod m20260701_062136_endoscopy_test_request_grade_rules;
mod m20260701_062153_endoscopy_test_request_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_062032_patients::Migration),
            Box::new(m20260701_062048_clinicians::Migration),
            Box::new(m20260701_062103_endoscopy_test_requests::Migration),
            Box::new(m20260701_062119_endoscopy_test_request_grades::Migration),
            Box::new(m20260701_062136_endoscopy_test_request_grade_rules::Migration),
            Box::new(m20260701_062153_endoscopy_test_request_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
