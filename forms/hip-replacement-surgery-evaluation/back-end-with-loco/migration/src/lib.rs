#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260814_175411_patients;
mod m20260814_175439_clinicians;
mod m20260814_175513_hip_replacement_surgery_evaluations;
mod m20260814_175536_hip_replacement_surgery_evaluation_grades;
mod m20260814_175611_hip_replacement_surgery_evaluation_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260814_175411_patients::Migration),
            Box::new(m20260814_175439_clinicians::Migration),
            Box::new(m20260814_175513_hip_replacement_surgery_evaluations::Migration),
            Box::new(m20260814_175536_hip_replacement_surgery_evaluation_grades::Migration),
            Box::new(m20260814_175611_hip_replacement_surgery_evaluation_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
