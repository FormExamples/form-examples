#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_133622_patients;
mod m20260702_133650_clinicians;
mod m20260702_133720_post_anaesthesia_care_unit_records;
mod m20260702_133752_post_anaesthesia_care_unit_record_grades;
mod m20260702_133818_post_anaesthesia_care_unit_record_grade_rules;
mod m20260702_133843_post_anaesthesia_care_unit_record_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_133622_patients::Migration),
            Box::new(m20260702_133650_clinicians::Migration),
            Box::new(m20260702_133720_post_anaesthesia_care_unit_records::Migration),
            Box::new(m20260702_133752_post_anaesthesia_care_unit_record_grades::Migration),
            Box::new(m20260702_133818_post_anaesthesia_care_unit_record_grade_rules::Migration),
            Box::new(m20260702_133843_post_anaesthesia_care_unit_record_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}