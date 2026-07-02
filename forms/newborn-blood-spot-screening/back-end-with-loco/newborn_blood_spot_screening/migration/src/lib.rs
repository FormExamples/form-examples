#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_205620_patients;
mod m20260702_205649_clinicians;
mod m20260702_205716_newborn_blood_spot_screenings;
mod m20260702_205742_newborn_blood_spot_screening_grades;
mod m20260702_205806_newborn_blood_spot_screening_grade_rules;
mod m20260702_205826_newborn_blood_spot_screening_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_205620_patients::Migration),
            Box::new(m20260702_205649_clinicians::Migration),
            Box::new(m20260702_205716_newborn_blood_spot_screenings::Migration),
            Box::new(m20260702_205742_newborn_blood_spot_screening_grades::Migration),
            Box::new(m20260702_205806_newborn_blood_spot_screening_grade_rules::Migration),
            Box::new(m20260702_205826_newborn_blood_spot_screening_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}