use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_drug_allergy_items",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("allergen", ColType::String),
            ("reaction_type", ColType::String),
            ("severity", ColType::String),
            ("timing", ColType::String),
            ("alternatives_tolerated", ColType::Text),
            ("sort_order", ColType::Integer),
            ],
            &[
            ("drug_allergies", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_drug_allergy_items").await
    }
}
