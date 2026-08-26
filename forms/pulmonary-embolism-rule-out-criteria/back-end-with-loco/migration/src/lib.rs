#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_094128_patients;
mod m20260702_094203_clinicians;
mod m20260702_094243_pulmonary_embolism_rule_out_criteria;
mod m20260702_094308_pulmonary_embolism_rule_out_criteria_grades;
mod m20260702_094527_pulmonary_embolism_rule_out_criteria_grade_rules;
mod m20260702_094600_pulmonary_embolism_rule_out_criteria_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_094128_patients::Migration),
            Box::new(m20260702_094203_clinicians::Migration),
            Box::new(m20260702_094243_pulmonary_embolism_rule_out_criteria::Migration),
            Box::new(m20260702_094308_pulmonary_embolism_rule_out_criteria_grades::Migration),
            Box::new(m20260702_094527_pulmonary_embolism_rule_out_criteria_grade_rules::Migration),
            Box::new(m20260702_094600_pulmonary_embolism_rule_out_criteria_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
