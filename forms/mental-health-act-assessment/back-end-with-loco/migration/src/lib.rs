#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_181254_patients;
mod m20260702_181317_clinicians;
mod m20260702_181346_mental_health_act_assessments;
mod m20260702_181413_mental_health_act_assessment_grades;
mod m20260702_181436_mental_health_act_assessment_grade_rules;
mod m20260702_181458_mental_health_act_assessment_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_181254_patients::Migration),
            Box::new(m20260702_181317_clinicians::Migration),
            Box::new(m20260702_181346_mental_health_act_assessments::Migration),
            Box::new(m20260702_181413_mental_health_act_assessment_grades::Migration),
            Box::new(m20260702_181436_mental_health_act_assessment_grade_rules::Migration),
            Box::new(m20260702_181458_mental_health_act_assessment_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
