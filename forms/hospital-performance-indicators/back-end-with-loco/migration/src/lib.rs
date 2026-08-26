#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260722_210109_hospital_performance_indicators;
mod m20260722_210129_hospital_performance_indicator_values;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260722_210109_hospital_performance_indicators::Migration),
            Box::new(m20260722_210129_hospital_performance_indicator_values::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
