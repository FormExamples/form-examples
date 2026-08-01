use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "casualty_card_assessment_plans",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("working_diagnosis", ColType::TextWithDefault(String::new())),
            ("differential_diagnoses", ColType::TextWithDefault(String::new())),
            ("clinical_impression", ColType::TextWithDefault(String::new())),
            ("risk_stratification", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("casualty_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_assessment_plans").await
    }
}
