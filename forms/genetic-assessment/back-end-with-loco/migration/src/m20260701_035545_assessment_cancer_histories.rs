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
            ("family_cancer_history", ColType::StringWithDefault(String::new())),
            ("multiple_family_cancers", ColType::StringWithDefault(String::new())),
            ("early_onset_cancer", ColType::StringWithDefault(String::new())),
            ("bilateral_cancer", ColType::StringWithDefault(String::new())),
            ("rare_tumour_types", ColType::StringWithDefault(String::new())),
            ("rare_tumour_details", ColType::TextWithDefault(String::new())),
            ("known_cancer_syndrome", ColType::StringWithDefault(String::new())),
            ("cancer_syndrome_details", ColType::TextWithDefault(String::new())),
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
