use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "casualty_card_medical_histories",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("past_medical_history", ColType::Text),
            ("past_surgical_history", ColType::Text),
            ("tetanus_status", ColType::Text),
            ("smoking_status", ColType::Text),
            ("alcohol_consumption", ColType::Text),
            ("recreational_drug_use", ColType::Text),
            ("last_oral_intake", ColType::Text),
            ],
            &[
            ("casualty_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_medical_histories").await
    }
}
