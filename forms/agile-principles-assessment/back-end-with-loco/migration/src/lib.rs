#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260630_201824_respondents;
mod m20260630_201845_agile_principles_assessments;
mod m20260630_201909_agile_principles_assessment_grades;
mod m20260630_201945_agile_principles_assessment_grade_rules;
mod m20260630_202007_agile_principles_assessment_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260630_201824_respondents::Migration),
            Box::new(m20260630_201845_agile_principles_assessments::Migration),
            Box::new(m20260630_201909_agile_principles_assessment_grades::Migration),
            Box::new(m20260630_201945_agile_principles_assessment_grade_rules::Migration),
            Box::new(m20260630_202007_agile_principles_assessment_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
