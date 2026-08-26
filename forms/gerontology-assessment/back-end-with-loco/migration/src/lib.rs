#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_035732_patients;
mod m20260701_035806_clinicians;
mod m20260701_035827_assessments;
mod m20260701_035848_assessment_polypharmacy_reviews;
mod m20260701_035910_assessment_polypharmacy_review_medications;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_035732_patients::Migration),
            Box::new(m20260701_035806_clinicians::Migration),
            Box::new(m20260701_035827_assessments::Migration),
            Box::new(m20260701_035848_assessment_polypharmacy_reviews::Migration),
            Box::new(m20260701_035910_assessment_polypharmacy_review_medications::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
