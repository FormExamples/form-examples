#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260630_202730_architectures;
mod m20260630_202755_arc42_documentations;
mod m20260630_202816_business_goals;
mod m20260630_202838_quality_goals;
mod m20260630_202903_stakeholders;
mod m20260630_202941_constraint_items;
mod m20260630_203004_context_partners;
mod m20260630_203036_technology_decisions;
mod m20260630_203100_building_blocks;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260630_202730_architectures::Migration),
            Box::new(m20260630_202755_arc42_documentations::Migration),
            Box::new(m20260630_202816_business_goals::Migration),
            Box::new(m20260630_202838_quality_goals::Migration),
            Box::new(m20260630_202903_stakeholders::Migration),
            Box::new(m20260630_202941_constraint_items::Migration),
            Box::new(m20260630_203004_context_partners::Migration),
            Box::new(m20260630_203036_technology_decisions::Migration),
            Box::new(m20260630_203100_building_blocks::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
