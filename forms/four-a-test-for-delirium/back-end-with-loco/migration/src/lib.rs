#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_092618_patients;
mod m20260702_092645_clinicians;
mod m20260702_092841_four_a_test_for_deliriums;
mod m20260702_092845_four_a_test_for_delirium_grades;
mod m20260702_092853_four_a_test_for_delirium_grade_rules;
mod m20260702_092908_four_a_test_for_delirium_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_092618_patients::Migration),
            Box::new(m20260702_092645_clinicians::Migration),
            Box::new(m20260702_092841_four_a_test_for_deliriums::Migration),
            Box::new(m20260702_092845_four_a_test_for_delirium_grades::Migration),
            Box::new(m20260702_092853_four_a_test_for_delirium_grade_rules::Migration),
            Box::new(m20260702_092908_four_a_test_for_delirium_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}