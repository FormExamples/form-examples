#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;

mod m20260510_000001_extensions;
mod m20260510_000002_create_reporter;
mod m20260510_000003_create_participant;
mod m20260510_000004_create_okr_objective;
mod m20260510_000005_create_okr_key_result;
mod m20260510_000006_create_okr_check_in;
mod m20260510_000007_create_okr_grade;
mod m20260510_000008_create_okr_grade_rule;
mod m20260510_000009_create_okr_grade_flag;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260510_000001_extensions::Migration),
            Box::new(m20260510_000002_create_reporter::Migration),
            Box::new(m20260510_000003_create_participant::Migration),
            Box::new(m20260510_000004_create_okr_objective::Migration),
            Box::new(m20260510_000005_create_okr_key_result::Migration),
            Box::new(m20260510_000006_create_okr_check_in::Migration),
            Box::new(m20260510_000007_create_okr_grade::Migration),
            Box::new(m20260510_000008_create_okr_grade_rule::Migration),
            Box::new(m20260510_000009_create_okr_grade_flag::Migration),
        ]
    }
}
