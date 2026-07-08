#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_141155_patients;
mod m20260702_141212_clinicians;
mod m20260702_141252_bhutani_bilirubin_nomograms;
mod m20260702_141330_bhutani_bilirubin_nomogram_grades;
mod m20260702_141356_bhutani_bilirubin_nomogram_grade_rules;
mod m20260702_141419_bhutani_bilirubin_nomogram_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_141155_patients::Migration),
            Box::new(m20260702_141212_clinicians::Migration),
            Box::new(m20260702_141252_bhutani_bilirubin_nomograms::Migration),
            Box::new(m20260702_141330_bhutani_bilirubin_nomogram_grades::Migration),
            Box::new(m20260702_141356_bhutani_bilirubin_nomogram_grade_rules::Migration),
            Box::new(m20260702_141419_bhutani_bilirubin_nomogram_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}