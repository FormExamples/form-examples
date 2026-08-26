#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_135801_patients;
mod m20260702_135821_clinicians;
mod m20260702_135850_partograms;
mod m20260702_135913_partogram_observations;
mod m20260702_135944_partogram_grades;
mod m20260702_140008_partogram_grade_rules;
mod m20260702_140028_partogram_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_135801_patients::Migration),
            Box::new(m20260702_135821_clinicians::Migration),
            Box::new(m20260702_135850_partograms::Migration),
            Box::new(m20260702_135913_partogram_observations::Migration),
            Box::new(m20260702_135944_partogram_grades::Migration),
            Box::new(m20260702_140008_partogram_grade_rules::Migration),
            Box::new(m20260702_140028_partogram_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
