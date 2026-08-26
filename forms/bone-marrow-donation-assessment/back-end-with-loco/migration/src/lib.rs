#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260630_204312_patients;
mod m20260630_204353_clinicians;
mod m20260630_204445_bone_marrow_donation_assessments;
mod m20260630_204526_grades;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260630_204312_patients::Migration),
            Box::new(m20260630_204353_clinicians::Migration),
            Box::new(m20260630_204445_bone_marrow_donation_assessments::Migration),
            Box::new(m20260630_204526_grades::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
