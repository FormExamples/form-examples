#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_140219_patients;
mod m20260702_140231_clinicians;
mod m20260702_140243_edinburgh_postnatal_depression_scales;
mod m20260702_140255_edinburgh_postnatal_depression_scale_grades;
mod m20260702_140307_edinburgh_postnatal_depression_scale_grade_rules;
mod m20260702_140319_edinburgh_postnatal_depression_scale_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_140219_patients::Migration),
            Box::new(m20260702_140231_clinicians::Migration),
            Box::new(m20260702_140243_edinburgh_postnatal_depression_scales::Migration),
            Box::new(m20260702_140255_edinburgh_postnatal_depression_scale_grades::Migration),
            Box::new(m20260702_140307_edinburgh_postnatal_depression_scale_grade_rules::Migration),
            Box::new(m20260702_140319_edinburgh_postnatal_depression_scale_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}