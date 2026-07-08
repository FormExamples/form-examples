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
            ("allow_brand_substitution", ColType::String),
            ("allow_generic_substitution", ColType::String),
            ("allow_dosage_adjustment", ColType::String),
            ("substitution_notes", ColType::Text),
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
