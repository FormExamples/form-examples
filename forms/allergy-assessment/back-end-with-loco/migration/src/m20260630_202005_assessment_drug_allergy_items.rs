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
            ("allergen", ColType::StringWithDefault(String::new())),
            ("reaction_type", ColType::StringWithDefault(String::new())),
            ("severity", ColType::StringWithDefault(String::new())),
            ("timing", ColType::StringWithDefault(String::new())),
            ("alternatives_tolerated", ColType::TextWithDefault(String::new())),
            ("sort_order", ColType::IntegerWithDefault(0)),
            ],
            &[
            ("assessment_drug_allergy", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_drug_allergy_items").await
    }
}
