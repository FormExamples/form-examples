#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_213521_patients;
mod m20260702_213544_clinicians;
mod m20260702_213606_nursing_care_plans;
mod m20260702_213627_nursing_care_plan_problems;
mod m20260702_213653_nursing_care_plan_goals;
mod m20260702_213717_nursing_care_plan_interventions;
mod m20260702_213737_nursing_care_plan_grades;
mod m20260702_213756_nursing_care_plan_grade_rules;
mod m20260702_213817_nursing_care_plan_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_213521_patients::Migration),
            Box::new(m20260702_213544_clinicians::Migration),
            Box::new(m20260702_213606_nursing_care_plans::Migration),
            Box::new(m20260702_213627_nursing_care_plan_problems::Migration),
            Box::new(m20260702_213653_nursing_care_plan_goals::Migration),
            Box::new(m20260702_213717_nursing_care_plan_interventions::Migration),
            Box::new(m20260702_213737_nursing_care_plan_grades::Migration),
            Box::new(m20260702_213756_nursing_care_plan_grade_rules::Migration),
            Box::new(m20260702_213817_nursing_care_plan_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}