use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "casualty_card_investigations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("blood_tests", ColType::Text),
            ("urinalysis", ColType::TextWithDefault(String::new())),
            ("pregnancy_test", ColType::TextWithDefault(String::new())),
            ("ecg_performed", ColType::TextWithDefault(String::new())),
            ("ecg_findings", ColType::TextWithDefault(String::new())),
            ("other_investigations", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("casualty_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_investigations").await
    }
}
