use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "outpatient_outcome_prem_ffts",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("fft_response", ColType::StringWithDefault(String::new())),
            ("fft_comment", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("outpatient_outcome", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "outpatient_outcome_prem_ffts").await
    }
}
