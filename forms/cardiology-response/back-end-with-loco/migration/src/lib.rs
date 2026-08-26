#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;

mod m20220101_000001_users;

mod m20260601_000001_patients;
mod m20260601_000002_clinicians;
mod m20260601_000003_cardiology_responses;
mod m20260601_000004_cardiology_response_grades;
mod m20260601_000005_cardiology_response_grade_rules;
mod m20260601_000006_cardiology_response_grade_flags;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260601_000001_patients::Migration),
            Box::new(m20260601_000002_clinicians::Migration),
            Box::new(m20260601_000003_cardiology_responses::Migration),
            Box::new(m20260601_000004_cardiology_response_grades::Migration),
            Box::new(m20260601_000005_cardiology_response_grade_rules::Migration),
            Box::new(m20260601_000006_cardiology_response_grade_flags::Migration),
        ]
    }
}
