#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_060210_patients;
mod m20260701_060231_clinicians;
mod m20260701_060248_assessments;
mod m20260701_060318_immunization_histories;
mod m20260701_060338_childhood_vaccinations;
mod m20260701_060405_adult_vaccinations;
mod m20260701_060424_travel_vaccinations;
mod m20260701_060446_occupational_vaccinations;
mod m20260701_060508_contraindications_allergies;
mod m20260701_060532_consent_informations;
mod m20260701_060556_administration_records;
mod m20260701_060625_clinical_reviews;
mod m20260701_060640_grades;
mod m20260701_060652_fired_rules;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_060210_patients::Migration),
            Box::new(m20260701_060231_clinicians::Migration),
            Box::new(m20260701_060248_assessments::Migration),
            Box::new(m20260701_060318_immunization_histories::Migration),
            Box::new(m20260701_060338_childhood_vaccinations::Migration),
            Box::new(m20260701_060405_adult_vaccinations::Migration),
            Box::new(m20260701_060424_travel_vaccinations::Migration),
            Box::new(m20260701_060446_occupational_vaccinations::Migration),
            Box::new(m20260701_060508_contraindications_allergies::Migration),
            Box::new(m20260701_060532_consent_informations::Migration),
            Box::new(m20260701_060556_administration_records::Migration),
            Box::new(m20260701_060625_clinical_reviews::Migration),
            Box::new(m20260701_060640_grades::Migration),
            Box::new(m20260701_060652_fired_rules::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}