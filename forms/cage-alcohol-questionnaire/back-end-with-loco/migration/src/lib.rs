#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_203302_patients;
mod m20260702_203329_clinicians;
mod m20260702_203402_cage_alcohol_questionnaires;
mod m20260702_203422_cage_alcohol_questionnaire_grades;
mod m20260702_203441_cage_alcohol_questionnaire_grade_rules;
mod m20260702_203500_cage_alcohol_questionnaire_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_203302_patients::Migration),
            Box::new(m20260702_203329_clinicians::Migration),
            Box::new(m20260702_203402_cage_alcohol_questionnaires::Migration),
            Box::new(m20260702_203422_cage_alcohol_questionnaire_grades::Migration),
            Box::new(m20260702_203441_cage_alcohol_questionnaire_grade_rules::Migration),
            Box::new(m20260702_203500_cage_alcohol_questionnaire_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
