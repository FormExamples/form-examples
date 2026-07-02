#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_133619_patients;
mod m20260702_133645_clinicians;
mod m20260702_133718_anaesthetic_records;
mod m20260702_133749_anaesthetic_record_drug_administrations;
mod m20260702_133816_anaesthetic_record_timed_observations;
mod m20260702_133842_anaesthetic_record_intra_operative_events;
mod m20260702_133912_anaesthetic_record_grades;
mod m20260702_133936_anaesthetic_record_grade_rules;
mod m20260702_133959_anaesthetic_record_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_133619_patients::Migration),
            Box::new(m20260702_133645_clinicians::Migration),
            Box::new(m20260702_133718_anaesthetic_records::Migration),
            Box::new(m20260702_133749_anaesthetic_record_drug_administrations::Migration),
            Box::new(m20260702_133816_anaesthetic_record_timed_observations::Migration),
            Box::new(m20260702_133842_anaesthetic_record_intra_operative_events::Migration),
            Box::new(m20260702_133912_anaesthetic_record_grades::Migration),
            Box::new(m20260702_133936_anaesthetic_record_grade_rules::Migration),
            Box::new(m20260702_133959_anaesthetic_record_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}