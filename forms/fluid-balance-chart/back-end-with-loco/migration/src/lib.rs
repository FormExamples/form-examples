#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_134800_patients;
mod m20260702_134828_clinicians;
mod m20260702_134851_fluid_balance_charts;
mod m20260702_134922_fluid_balance_chart_entries;
mod m20260702_134947_fluid_balance_chart_grades;
mod m20260702_135013_fluid_balance_chart_grade_rules;
mod m20260702_135035_fluid_balance_chart_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_134800_patients::Migration),
            Box::new(m20260702_134828_clinicians::Migration),
            Box::new(m20260702_134851_fluid_balance_charts::Migration),
            Box::new(m20260702_134922_fluid_balance_chart_entries::Migration),
            Box::new(m20260702_134947_fluid_balance_chart_grades::Migration),
            Box::new(m20260702_135013_fluid_balance_chart_grade_rules::Migration),
            Box::new(m20260702_135035_fluid_balance_chart_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
