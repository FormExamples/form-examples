use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "architecture_decision_record_notes",
            &[
            
            ("id", ColType::PkAuto),
            
            ("noted_at", ColType::TimestampWithTimeZone),
            ("noted_by", ColType::StringWithDefault(String::new())),
            ("body", ColType::Text),
            ],
            &[
            ("architecture_decision_record", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "architecture_decision_record_notes").await
    }
}
