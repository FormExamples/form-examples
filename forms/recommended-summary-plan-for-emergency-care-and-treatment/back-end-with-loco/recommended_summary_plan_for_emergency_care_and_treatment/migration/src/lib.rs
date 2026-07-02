#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_134804_patients;
mod m20260702_134826_clinicians;
mod m20260702_134901_respect;
mod m20260702_134935_respect_grades;
mod m20260702_134959_respect_grade_rules;
mod m20260702_135024_respect_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_134804_patients::Migration),
            Box::new(m20260702_134826_clinicians::Migration),
            Box::new(m20260702_134901_respect::Migration),
            Box::new(m20260702_134935_respect_grades::Migration),
            Box::new(m20260702_134959_respect_grade_rules::Migration),
            Box::new(m20260702_135024_respect_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}