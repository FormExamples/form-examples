#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_141210_patients;
mod m20260702_141237_clinicians;
mod m20260702_141315_columbia_suicide_severity_rating_scales;
mod m20260702_141347_columbia_suicide_severity_rating_scale_grades;
mod m20260702_141411_columbia_suicide_severity_rating_scale_grade_rules;
mod m20260702_141435_columbia_suicide_severity_rating_scale_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_141210_patients::Migration),
            Box::new(m20260702_141237_clinicians::Migration),
            Box::new(m20260702_141315_columbia_suicide_severity_rating_scales::Migration),
            Box::new(m20260702_141347_columbia_suicide_severity_rating_scale_grades::Migration),
            Box::new(m20260702_141411_columbia_suicide_severity_rating_scale_grade_rules::Migration),
            Box::new(m20260702_141435_columbia_suicide_severity_rating_scale_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}