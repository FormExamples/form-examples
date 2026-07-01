#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260630_201722_organizations;
mod m20260630_201809_respondents;
mod m20260630_201834_agile_consulting_scorecard_for_hiring_helps;
mod m20260630_201856_agile_consulting_scorecard_for_hiring_help_grades;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260630_201722_organizations::Migration),
            Box::new(m20260630_201809_respondents::Migration),
            Box::new(m20260630_201834_agile_consulting_scorecard_for_hiring_helps::Migration),
            Box::new(m20260630_201856_agile_consulting_scorecard_for_hiring_help_grades::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}