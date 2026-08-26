#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_204255_patients;
mod m20260702_204444_clinicians;
mod m20260702_204518_breast_screenings;
mod m20260702_204547_breast_screening_grades;
mod m20260702_204616_breast_screening_grade_rules;
mod m20260702_204641_breast_screening_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_204255_patients::Migration),
            Box::new(m20260702_204444_clinicians::Migration),
            Box::new(m20260702_204518_breast_screenings::Migration),
            Box::new(m20260702_204547_breast_screening_grades::Migration),
            Box::new(m20260702_204616_breast_screening_grade_rules::Migration),
            Box::new(m20260702_204641_breast_screening_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
