#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260601_000002_workers;
mod m20260601_000003_managers;
mod m20260601_000004_neurodiversity_adjustment_requests;
mod m20260601_000005_neurodiversity_adjustment_request_grades;
mod m20260601_000006_neurodiversity_adjustment_request_grade_rules;
mod m20260601_000007_neurodiversity_adjustment_request_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260601_000002_workers::Migration),
            Box::new(m20260601_000003_managers::Migration),
            Box::new(m20260601_000004_neurodiversity_adjustment_requests::Migration),
            Box::new(m20260601_000005_neurodiversity_adjustment_request_grades::Migration),
            Box::new(m20260601_000006_neurodiversity_adjustment_request_grade_rules::Migration),
            Box::new(m20260601_000007_neurodiversity_adjustment_request_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
