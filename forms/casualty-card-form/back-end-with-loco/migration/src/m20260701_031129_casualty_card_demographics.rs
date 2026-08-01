use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "casualty_card_demographics",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("address", ColType::TextWithDefault(String::new())),
            ("postcode", ColType::TextWithDefault(String::new())),
            ("phone", ColType::TextWithDefault(String::new())),
            ("email", ColType::TextWithDefault(String::new())),
            ("ethnicity", ColType::TextWithDefault(String::new())),
            ("preferred_language", ColType::TextWithDefault(String::new())),
            ("interpreter_required", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("casualty_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_demographics").await
    }
}
