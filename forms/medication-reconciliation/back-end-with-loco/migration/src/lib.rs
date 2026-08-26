#![forbid(unsafe_code)]
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_133706_patients;
mod m20260702_133739_clinicians;
mod m20260702_133806_medication_reconciliations;
mod m20260702_133840_medication_reconciliation_line_items;
mod m20260702_133905_medication_reconciliation_information_sources;
mod m20260702_133928_medication_reconciliation_allergies;
mod m20260702_133949_medication_reconciliation_discrepancies;
mod m20260702_134019_medication_reconciliation_grades;
mod m20260702_134039_medication_reconciliation_grade_rules;
mod m20260702_134102_medication_reconciliation_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_133706_patients::Migration),
            Box::new(m20260702_133739_clinicians::Migration),
            Box::new(m20260702_133806_medication_reconciliations::Migration),
            Box::new(m20260702_133840_medication_reconciliation_line_items::Migration),
            Box::new(m20260702_133905_medication_reconciliation_information_sources::Migration),
            Box::new(m20260702_133928_medication_reconciliation_allergies::Migration),
            Box::new(m20260702_133949_medication_reconciliation_discrepancies::Migration),
            Box::new(m20260702_134019_medication_reconciliation_grades::Migration),
            Box::new(m20260702_134039_medication_reconciliation_grade_rules::Migration),
            Box::new(m20260702_134102_medication_reconciliation_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
