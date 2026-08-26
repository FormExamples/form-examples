#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_030952_patients;
mod m20260701_031025_clinicians;
mod m20260701_031053_casualty_cards;
mod m20260701_031129_casualty_card_demographics;
mod m20260701_031203_casualty_card_next_of_kins;
mod m20260701_031236_casualty_card_gps;
mod m20260701_031329_casualty_card_arrival_triages;
mod m20260701_031354_casualty_card_presenting_complaints;
mod m20260701_031417_casualty_card_pain_assessments;
mod m20260701_031447_casualty_card_medical_histories;
mod m20260701_031520_casualty_card_medications;
mod m20260701_031542_casualty_card_allergies;
mod m20260701_031615_casualty_card_vital_signs;
mod m20260701_031647_casualty_card_primary_surveys;
mod m20260701_031712_casualty_card_clinical_examinations;
mod m20260701_031745_casualty_card_investigations;
mod m20260701_031815_casualty_card_treatments;
mod m20260701_031845_casualty_card_assessment_plans;
mod m20260701_031921_casualty_card_dispositions;
mod m20260701_031951_casualty_card_safeguarding_consents;
mod m20260701_032021_news2_results;
mod m20260701_032103_flagged_issues;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_030952_patients::Migration),
            Box::new(m20260701_031025_clinicians::Migration),
            Box::new(m20260701_031053_casualty_cards::Migration),
            Box::new(m20260701_031129_casualty_card_demographics::Migration),
            Box::new(m20260701_031203_casualty_card_next_of_kins::Migration),
            Box::new(m20260701_031236_casualty_card_gps::Migration),
            Box::new(m20260701_031329_casualty_card_arrival_triages::Migration),
            Box::new(m20260701_031354_casualty_card_presenting_complaints::Migration),
            Box::new(m20260701_031417_casualty_card_pain_assessments::Migration),
            Box::new(m20260701_031447_casualty_card_medical_histories::Migration),
            Box::new(m20260701_031520_casualty_card_medications::Migration),
            Box::new(m20260701_031542_casualty_card_allergies::Migration),
            Box::new(m20260701_031615_casualty_card_vital_signs::Migration),
            Box::new(m20260701_031647_casualty_card_primary_surveys::Migration),
            Box::new(m20260701_031712_casualty_card_clinical_examinations::Migration),
            Box::new(m20260701_031745_casualty_card_investigations::Migration),
            Box::new(m20260701_031815_casualty_card_treatments::Migration),
            Box::new(m20260701_031845_casualty_card_assessment_plans::Migration),
            Box::new(m20260701_031921_casualty_card_dispositions::Migration),
            Box::new(m20260701_031951_casualty_card_safeguarding_consents::Migration),
            Box::new(m20260701_032021_news2_results::Migration),
            Box::new(m20260701_032103_flagged_issues::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
