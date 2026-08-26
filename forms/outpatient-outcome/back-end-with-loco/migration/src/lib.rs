#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_045855_patients;
mod m20260701_045913_clinicians;
mod m20260701_045932_outpatient_outcomes;
mod m20260701_045952_outpatient_outcome_encounters;
mod m20260701_050012_outpatient_outcome_operationals;
mod m20260701_050034_outpatient_outcome_clinicals;
mod m20260701_050059_outpatient_outcome_prom_eq5d5ls;
mod m20260701_050141_outpatient_outcome_prom_grcs;
mod m20260701_050218_outpatient_outcome_prom_promis;
mod m20260701_050244_outpatient_outcome_prem_ffts;
mod m20260701_050308_outpatient_outcome_followups;
mod m20260701_050335_outpatient_outcome_signoffs;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_045855_patients::Migration),
            Box::new(m20260701_045913_clinicians::Migration),
            Box::new(m20260701_045932_outpatient_outcomes::Migration),
            Box::new(m20260701_045952_outpatient_outcome_encounters::Migration),
            Box::new(m20260701_050012_outpatient_outcome_operationals::Migration),
            Box::new(m20260701_050034_outpatient_outcome_clinicals::Migration),
            Box::new(m20260701_050059_outpatient_outcome_prom_eq5d5ls::Migration),
            Box::new(m20260701_050141_outpatient_outcome_prom_grcs::Migration),
            Box::new(m20260701_050218_outpatient_outcome_prom_promis::Migration),
            Box::new(m20260701_050244_outpatient_outcome_prem_ffts::Migration),
            Box::new(m20260701_050308_outpatient_outcome_followups::Migration),
            Box::new(m20260701_050335_outpatient_outcome_signoffs::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
