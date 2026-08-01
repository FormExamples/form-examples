use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "prescription_substitution_options",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("allow_brand_substitution", ColType::StringWithDefault(String::new())),
            ("allow_generic_substitution", ColType::StringWithDefault(String::new())),
            ("allow_dosage_adjustment", ColType::StringWithDefault(String::new())),
            ("substitution_notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("prescription_request", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "prescription_substitution_options").await
    }
}
