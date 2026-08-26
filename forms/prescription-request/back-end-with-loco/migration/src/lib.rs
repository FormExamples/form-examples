#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_051636_patients;
mod m20260701_051658_clinicians;
mod m20260701_051722_prescription_requests;
mod m20260701_051753_prescription_details;
mod m20260701_051815_prescription_substitution_options;
mod m20260701_051836_prescription_request_types;
mod m20260701_051909_grades;
mod m20260701_051930_grading_fired_rules;
mod m20260701_051952_grading_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_051636_patients::Migration),
            Box::new(m20260701_051658_clinicians::Migration),
            Box::new(m20260701_051722_prescription_requests::Migration),
            Box::new(m20260701_051753_prescription_details::Migration),
            Box::new(m20260701_051815_prescription_substitution_options::Migration),
            Box::new(m20260701_051836_prescription_request_types::Migration),
            Box::new(m20260701_051909_grades::Migration),
            Box::new(m20260701_051930_grading_fired_rules::Migration),
            Box::new(m20260701_051952_grading_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
