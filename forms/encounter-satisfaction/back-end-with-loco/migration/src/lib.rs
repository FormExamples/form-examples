#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_062233_patients;
mod m20260701_062303_clinicians;
mod m20260701_062320_encounter_satisfactions;
mod m20260701_062337_visit_informations;
mod m20260701_062355_access_schedulings;
mod m20260701_062415_communications;
mod m20260701_062441_staff_professionalisms;
mod m20260701_062500_care_qualities;
mod m20260701_062521_environments;
mod m20260701_062542_overall_satisfactions;
mod m20260701_062609_satisfaction_results;
mod m20260701_062630_flagged_issues;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_062233_patients::Migration),
            Box::new(m20260701_062303_clinicians::Migration),
            Box::new(m20260701_062320_encounter_satisfactions::Migration),
            Box::new(m20260701_062337_visit_informations::Migration),
            Box::new(m20260701_062355_access_schedulings::Migration),
            Box::new(m20260701_062415_communications::Migration),
            Box::new(m20260701_062441_staff_professionalisms::Migration),
            Box::new(m20260701_062500_care_qualities::Migration),
            Box::new(m20260701_062521_environments::Migration),
            Box::new(m20260701_062542_overall_satisfactions::Migration),
            Box::new(m20260701_062609_satisfaction_results::Migration),
            Box::new(m20260701_062630_flagged_issues::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
