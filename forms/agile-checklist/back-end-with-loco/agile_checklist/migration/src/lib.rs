#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260630_201437_respondents;
mod m20260630_201502_agile_checklists;
mod m20260630_201528_agile_checklist_grades;
mod m20260630_201554_agile_checklist_grade_rules;
mod m20260630_201619_agile_checklist_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260630_201437_respondents::Migration),
            Box::new(m20260630_201502_agile_checklists::Migration),
            Box::new(m20260630_201528_agile_checklist_grades::Migration),
            Box::new(m20260630_201554_agile_checklist_grade_rules::Migration),
            Box::new(m20260630_201619_agile_checklist_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}