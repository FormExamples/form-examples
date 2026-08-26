#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260630_203412_patients;
mod m20260630_203431_clinicians;
mod m20260630_203455_biopsy_test_requests;
mod m20260630_203524_biopsy_test_request_grades;
mod m20260630_203607_biopsy_test_request_grade_rules;
mod m20260630_203631_biopsy_test_request_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260630_203412_patients::Migration),
            Box::new(m20260630_203431_clinicians::Migration),
            Box::new(m20260630_203455_biopsy_test_requests::Migration),
            Box::new(m20260630_203524_biopsy_test_request_grades::Migration),
            Box::new(m20260630_203607_biopsy_test_request_grade_rules::Migration),
            Box::new(m20260630_203631_biopsy_test_request_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
