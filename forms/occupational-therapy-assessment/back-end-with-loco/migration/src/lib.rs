#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_045204_patients;
mod m20260701_045239_clinicians;
mod m20260701_045301_assessments;
mod m20260701_045322_assessment_performance_ratings;
mod m20260701_045345_assessment_performance_rating_items;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_045204_patients::Migration),
            Box::new(m20260701_045239_clinicians::Migration),
            Box::new(m20260701_045301_assessments::Migration),
            Box::new(m20260701_045322_assessment_performance_ratings::Migration),
            Box::new(m20260701_045345_assessment_performance_rating_items::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
