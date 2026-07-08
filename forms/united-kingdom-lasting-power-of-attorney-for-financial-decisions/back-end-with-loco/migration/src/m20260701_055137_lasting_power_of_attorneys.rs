use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "lasting_power_of_attorneys",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("decision_mode", ColType::Text),
            ("decision_mode_mixed_text", ColType::Text),
            ("when_attorneys_can_act", ColType::Text),
            ("preferences_text", ColType::Text),
            ("instructions_text", ColType::Text),
            ("legal_rights_acknowledged", ColType::Boolean),
            ("opg_reference_number", ColType::Text),
            ("opg_registration_date", ColType::DateNull),
            ("status", ColType::Text),
            ],
            &[
            ("people", "donor_person_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lasting_power_of_attorneys").await
    }
}
