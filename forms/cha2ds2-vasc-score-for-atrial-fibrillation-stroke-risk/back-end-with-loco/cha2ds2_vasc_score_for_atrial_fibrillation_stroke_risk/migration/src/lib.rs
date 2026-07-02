#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260702_094232_patients;
mod m20260702_094302_clinicians;
mod m20260702_094330_cha2ds2_vascs;
mod m20260702_094405_cha2ds2_vasc_grades;
mod m20260702_094436_cha2ds2_vasc_grade_rules;
mod m20260702_094454_cha2ds2_vasc_grade_flags;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260702_094232_patients::Migration),
            Box::new(m20260702_094302_clinicians::Migration),
            Box::new(m20260702_094330_cha2ds2_vascs::Migration),
            Box::new(m20260702_094405_cha2ds2_vasc_grades::Migration),
            Box::new(m20260702_094436_cha2ds2_vasc_grade_rules::Migration),
            Box::new(m20260702_094454_cha2ds2_vasc_grade_flags::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}