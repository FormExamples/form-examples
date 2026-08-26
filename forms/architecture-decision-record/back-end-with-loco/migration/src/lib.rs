#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;

mod m20260513_053504_authors;
mod m20260513_053539_organizations;
mod m20260513_053616_architecture_decision_records;
mod m20260513_053640_architecture_decision_record_positions;
mod m20260513_053659_architecture_decision_record_notes;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260513_053504_authors::Migration),
            Box::new(m20260513_053539_organizations::Migration),
            Box::new(m20260513_053616_architecture_decision_records::Migration),
            Box::new(m20260513_053640_architecture_decision_record_positions::Migration),
            Box::new(m20260513_053659_architecture_decision_record_notes::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
