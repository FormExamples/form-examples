#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_043407_organizers;
mod m20260701_043425_meetings;
mod m20260701_043447_agenda_items;
mod m20260701_043510_participants;
mod m20260701_043533_resources;
mod m20260701_043603_recurring_rules;
mod m20260701_043624_action_items;
mod m20260701_043647_meeting_outputs;
mod m20260701_043714_meeting_outcomes;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_043407_organizers::Migration),
            Box::new(m20260701_043425_meetings::Migration),
            Box::new(m20260701_043447_agenda_items::Migration),
            Box::new(m20260701_043510_participants::Migration),
            Box::new(m20260701_043533_resources::Migration),
            Box::new(m20260701_043603_recurring_rules::Migration),
            Box::new(m20260701_043624_action_items::Migration),
            Box::new(m20260701_043647_meeting_outputs::Migration),
            Box::new(m20260701_043714_meeting_outcomes::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
