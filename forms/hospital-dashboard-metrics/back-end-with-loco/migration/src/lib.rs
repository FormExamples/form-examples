#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260722_202826_hospital_dashboard_metrics;
mod m20260722_202842_hospital_dashboard_metric_values;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260722_202826_hospital_dashboard_metrics::Migration),
            Box::new(m20260722_202842_hospital_dashboard_metric_values::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}