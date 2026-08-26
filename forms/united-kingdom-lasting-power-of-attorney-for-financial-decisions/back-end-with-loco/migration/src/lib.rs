#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_055050_people;
mod m20260701_055117_addresses;
mod m20260701_055137_lasting_power_of_attorneys;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_055050_people::Migration),
            Box::new(m20260701_055117_addresses::Migration),
            Box::new(m20260701_055137_lasting_power_of_attorneys::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
