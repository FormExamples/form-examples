#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260722_200042_hospital_daily_monitoring_checklists;
mod m20260722_200110_hospital_daily_monitoring_checklist_items;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260722_200042_hospital_daily_monitoring_checklists::Migration),
            Box::new(m20260722_200110_hospital_daily_monitoring_checklist_items::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
