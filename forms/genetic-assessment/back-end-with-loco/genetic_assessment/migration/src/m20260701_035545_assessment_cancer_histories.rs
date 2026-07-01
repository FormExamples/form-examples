use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_cancer_histories",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("family_cancer_history", ColType::String),
            ("multiple_family_cancers", ColType::String),
            ("early_onset_cancer", ColType::String),
            ("bilateral_cancer", ColType::String),
            ("rare_tumour_types", ColType::String),
            ("rare_tumour_details", ColType::Text),
            ("known_cancer_syndrome", ColType::String),
            ("cancer_syndrome_details", ColType::Text),
            ("cancer_risk_score", ColType::IntegerNull),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_cancer_histories").await
    }
}
