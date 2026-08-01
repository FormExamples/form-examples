use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "demographics_ethnicities",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("age", ColType::IntegerNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("ethnicity", ColType::StringWithDefault(String::new())),
            ("townsend_deprivation", ColType::DoubleNull),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "demographics_ethnicities").await
    }
}
