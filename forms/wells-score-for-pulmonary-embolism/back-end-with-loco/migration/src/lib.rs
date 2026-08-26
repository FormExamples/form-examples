#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_092632_patients;
mod m20260702_092708_clinicians;
mod m20260702_092732_wells_score_for_pulmonary_embolisms;
mod m20260702_092806_wells_score_for_pulmonary_embolism_grades;
mod m20260702_092830_wells_score_for_pulmonary_embolism_grade_rules;
mod m20260702_092851_wells_score_for_pulmonary_embolism_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_092632_patients::Migration),
            Box::new(m20260702_092708_clinicians::Migration),
            Box::new(m20260702_092732_wells_score_for_pulmonary_embolisms::Migration),
            Box::new(m20260702_092806_wells_score_for_pulmonary_embolism_grades::Migration),
            Box::new(m20260702_092830_wells_score_for_pulmonary_embolism_grade_rules::Migration),
            Box::new(m20260702_092851_wells_score_for_pulmonary_embolism_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
