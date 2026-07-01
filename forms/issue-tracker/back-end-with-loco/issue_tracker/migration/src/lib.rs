#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260701_041538_reporters;
mod m20260701_041610_participants;
mod m20260701_041630_issue_trackers;
mod m20260701_041653_issue_tracker_grades;
mod m20260701_041716_issue_tracker_grade_rules;
mod m20260701_041742_issue_tracker_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260701_041538_reporters::Migration),
            Box::new(m20260701_041610_participants::Migration),
            Box::new(m20260701_041630_issue_trackers::Migration),
            Box::new(m20260701_041653_issue_tracker_grades::Migration),
            Box::new(m20260701_041716_issue_tracker_grade_rules::Migration),
            Box::new(m20260701_041742_issue_tracker_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}