#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_040142_patients;
mod m20260701_040204_clinicians;
mod m20260701_040226_assessments;
mod m20260701_040252_demographics_ethnicities;
mod m20260701_040318_blood_pressures;
mod m20260701_040356_cholesterols;
mod m20260701_040417_medical_conditions;
mod m20260701_040439_family_histories;
mod m20260701_040502_smoking_alcohols;
mod m20260701_040540_grading_additional_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_040142_patients::Migration),
            Box::new(m20260701_040204_clinicians::Migration),
            Box::new(m20260701_040226_assessments::Migration),
            Box::new(m20260701_040252_demographics_ethnicities::Migration),
            Box::new(m20260701_040318_blood_pressures::Migration),
            Box::new(m20260701_040356_cholesterols::Migration),
            Box::new(m20260701_040417_medical_conditions::Migration),
            Box::new(m20260701_040439_family_histories::Migration),
            Box::new(m20260701_040502_smoking_alcohols::Migration),
            Box::new(m20260701_040540_grading_additional_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
