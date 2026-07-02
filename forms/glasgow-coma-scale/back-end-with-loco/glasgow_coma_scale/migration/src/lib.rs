#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_091629_patients;
mod m20260702_091652_clinicians;
mod m20260702_091720_glasgow_coma_scales;
mod m20260702_091751_glasgow_coma_scale_grades;
mod m20260702_091816_glasgow_coma_scale_grade_rules;
mod m20260702_091841_glasgow_coma_scale_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_091629_patients::Migration),
            Box::new(m20260702_091652_clinicians::Migration),
            Box::new(m20260702_091720_glasgow_coma_scales::Migration),
            Box::new(m20260702_091751_glasgow_coma_scale_grades::Migration),
            Box::new(m20260702_091816_glasgow_coma_scale_grade_rules::Migration),
            Box::new(m20260702_091841_glasgow_coma_scale_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}