use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "apgar_score_timepoints",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("timepoint_minutes", ColType::IntegerNull),
            ("appearance", ColType::StringWithDefault(String::new())),
            ("pulse", ColType::StringWithDefault(String::new())),
            ("grimace", ColType::StringWithDefault(String::new())),
            ("activity", ColType::StringWithDefault(String::new())),
            ("respiration", ColType::StringWithDefault(String::new())),
            ("total", ColType::IntegerNull),
            ("band", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("apgar_score", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "apgar_score_timepoints").await
    }
}
