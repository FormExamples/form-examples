use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "apgar_scores",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("born_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("gestational_age_weeks", ColType::DoubleNull),
            ("mode_of_delivery", ColType::String),
            ("newborn_identifier", ColType::String),
            ("sex", ColType::String),
            ("birth_order", ColType::IntegerNull),
            ("resuscitation_measures", ColType::Text),
            ("clinician_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "apgar_scores").await
    }
}
