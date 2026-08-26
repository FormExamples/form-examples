#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_055136_donors;
mod m20260701_055201_attorneys;
mod m20260701_055223_replacement_attorneys;
mod m20260701_055255_certificate_providers;
mod m20260701_055316_person_to_notifies;
mod m20260701_055339_lpas;
mod m20260701_055401_lpa_attorneys;
mod m20260701_055435_lpa_replacement_attorneys;
mod m20260701_055458_lpa_person_to_notifies;
mod m20260701_055522_lpa_decision_rules;
mod m20260701_055555_lpa_lst_choices;
mod m20260701_055617_lpa_preferences;
mod m20260701_055639_lpa_instructions;
mod m20260701_055705_lpa_signatures;
mod m20260701_055734_lpa_registration_applications;
mod m20260701_055806_lpa_validities;
mod m20260701_055831_lpa_validity_fired_rules;
mod m20260701_055856_lpa_validity_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_055136_donors::Migration),
            Box::new(m20260701_055201_attorneys::Migration),
            Box::new(m20260701_055223_replacement_attorneys::Migration),
            Box::new(m20260701_055255_certificate_providers::Migration),
            Box::new(m20260701_055316_person_to_notifies::Migration),
            Box::new(m20260701_055339_lpas::Migration),
            Box::new(m20260701_055401_lpa_attorneys::Migration),
            Box::new(m20260701_055435_lpa_replacement_attorneys::Migration),
            Box::new(m20260701_055458_lpa_person_to_notifies::Migration),
            Box::new(m20260701_055522_lpa_decision_rules::Migration),
            Box::new(m20260701_055555_lpa_lst_choices::Migration),
            Box::new(m20260701_055617_lpa_preferences::Migration),
            Box::new(m20260701_055639_lpa_instructions::Migration),
            Box::new(m20260701_055705_lpa_signatures::Migration),
            Box::new(m20260701_055734_lpa_registration_applications::Migration),
            Box::new(m20260701_055806_lpa_validities::Migration),
            Box::new(m20260701_055831_lpa_validity_fired_rules::Migration),
            Box::new(m20260701_055856_lpa_validity_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
