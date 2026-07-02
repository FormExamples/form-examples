#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_204237_patients;
mod m20260702_204237_clinicians;
mod m20260702_204237_bowel_cancer_screening_fits;
mod m20260702_204237_bowel_cancer_screening_fit_grades;
mod m20260702_204237_bowel_cancer_screening_fit_grade_rules;
mod m20260702_204237_bowel_cancer_screening_fit_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_204237_patients::Migration),
            Box::new(m20260702_204237_clinicians::Migration),
            Box::new(m20260702_204237_bowel_cancer_screening_fits::Migration),
            Box::new(m20260702_204237_bowel_cancer_screening_fit_grades::Migration),
            Box::new(m20260702_204237_bowel_cancer_screening_fit_grade_rules::Migration),
            Box::new(m20260702_204237_bowel_cancer_screening_fit_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
