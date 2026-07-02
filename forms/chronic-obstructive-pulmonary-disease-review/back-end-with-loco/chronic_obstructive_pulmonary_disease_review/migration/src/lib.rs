#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_210509_patients;
mod m20260702_210536_clinicians;
mod m20260702_210608_chronic_obstructive_pulmonary_disease_reviews;
mod m20260702_210638_chronic_obstructive_pulmonary_disease_review_grades;
mod m20260702_210705_chronic_obstructive_pulmonary_disease_review_grade_rules;
mod m20260702_210729_chronic_obstructive_pulmonary_disease_review_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_210509_patients::Migration),
            Box::new(m20260702_210536_clinicians::Migration),
            Box::new(m20260702_210608_chronic_obstructive_pulmonary_disease_reviews::Migration),
            Box::new(m20260702_210638_chronic_obstructive_pulmonary_disease_review_grades::Migration),
            Box::new(m20260702_210705_chronic_obstructive_pulmonary_disease_review_grade_rules::Migration),
            Box::new(m20260702_210729_chronic_obstructive_pulmonary_disease_review_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}