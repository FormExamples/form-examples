use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "validation_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("completeness_score", ColType::IntegerWithDefault(0)),
            ("completeness_status", ColType::StringWithDefault(String::new())),
            ("validation_status", ColType::StringWithDefault(String::new())),
            ("validated_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("release_form", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "validation_results").await
    }
}
