#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_212649_patients;
mod m20260702_212712_clinicians;
mod m20260702_212741_general_practitioner_referral_letters;
mod m20260702_212807_general_practitioner_referral_letter_grades;
mod m20260702_212830_general_practitioner_referral_letter_grade_rules;
mod m20260702_212856_general_practitioner_referral_letter_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_212649_patients::Migration),
            Box::new(m20260702_212712_clinicians::Migration),
            Box::new(m20260702_212741_general_practitioner_referral_letters::Migration),
            Box::new(m20260702_212807_general_practitioner_referral_letter_grades::Migration),
            Box::new(m20260702_212830_general_practitioner_referral_letter_grade_rules::Migration),
            Box::new(m20260702_212856_general_practitioner_referral_letter_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
