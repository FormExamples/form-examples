#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_092448_patients;
mod m20260702_092519_clinicians;
mod m20260702_092631_confusion_assessment_methods;
mod m20260702_092714_confusion_assessment_method_grades;
mod m20260702_092747_confusion_assessment_method_grade_rules;
mod m20260702_092811_confusion_assessment_method_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_092448_patients::Migration),
            Box::new(m20260702_092519_clinicians::Migration),
            Box::new(m20260702_092631_confusion_assessment_methods::Migration),
            Box::new(m20260702_092714_confusion_assessment_method_grades::Migration),
            Box::new(m20260702_092747_confusion_assessment_method_grade_rules::Migration),
            Box::new(m20260702_092811_confusion_assessment_method_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
