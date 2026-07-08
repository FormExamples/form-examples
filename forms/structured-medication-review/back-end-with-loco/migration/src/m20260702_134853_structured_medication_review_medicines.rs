use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "structured_medication_review_medicines",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("drug_name", ColType::Text),
            ("form_strength", ColType::Text),
            ("dose_regimen", ColType::Text),
            ("indication", ColType::Text),
            ("indication_recorded", ColType::String),
            ("is_regular", ColType::String),
            ("is_high_risk", ColType::String),
            ("high_risk_class", ColType::String),
            ("adherence", ColType::String),
            ("anticholinergic_burden_points", ColType::IntegerNull),
            ("monitoring_required", ColType::String),
            ("monitoring_up_to_date", ColType::String),
            ("deprescribing_candidate", ColType::String),
            ("stopp_criterion", ColType::Text),
            ("start_criterion", ColType::Text),
            ],
            &[
            ("structured_medication_review", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "structured_medication_review_medicines").await
    }
}
