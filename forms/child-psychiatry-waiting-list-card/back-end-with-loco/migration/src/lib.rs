#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_043231_patients;
mod m20260701_043253_practitioners;
mod m20260701_043320_child_psych_waiting_list_cards;
mod m20260701_043350_child_psych_waiting_list_card_appointments;
mod m20260701_043411_child_psych_waiting_list_card_grades;
mod m20260701_043437_child_psych_waiting_list_card_grade_rules;
mod m20260701_043500_child_psych_waiting_list_card_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_043231_patients::Migration),
            Box::new(m20260701_043253_practitioners::Migration),
            Box::new(m20260701_043320_child_psych_waiting_list_cards::Migration),
            Box::new(m20260701_043350_child_psych_waiting_list_card_appointments::Migration),
            Box::new(m20260701_043411_child_psych_waiting_list_card_grades::Migration),
            Box::new(m20260701_043437_child_psych_waiting_list_card_grade_rules::Migration),
            Box::new(m20260701_043500_child_psych_waiting_list_card_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
