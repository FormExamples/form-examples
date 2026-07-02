#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_134705_patients;
mod m20260702_134753_clinicians;
mod m20260702_134825_structured_medication_reviews;
mod m20260702_134853_structured_medication_review_medicines;
mod m20260702_134915_structured_medication_review_grades;
mod m20260702_134942_structured_medication_review_grade_rules;
mod m20260702_135009_structured_medication_review_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_134705_patients::Migration),
            Box::new(m20260702_134753_clinicians::Migration),
            Box::new(m20260702_134825_structured_medication_reviews::Migration),
            Box::new(m20260702_134853_structured_medication_review_medicines::Migration),
            Box::new(m20260702_134915_structured_medication_review_grades::Migration),
            Box::new(m20260702_134942_structured_medication_review_grade_rules::Migration),
            Box::new(m20260702_135009_structured_medication_review_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}