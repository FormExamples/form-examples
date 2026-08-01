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
            
            ("drug_name", ColType::TextWithDefault(String::new())),
            ("form_strength", ColType::TextWithDefault(String::new())),
            ("dose_regimen", ColType::TextWithDefault(String::new())),
            ("indication", ColType::TextWithDefault(String::new())),
            ("indication_recorded", ColType::StringWithDefault(String::new())),
            ("is_regular", ColType::StringWithDefault(String::new())),
            ("is_high_risk", ColType::StringWithDefault(String::new())),
            ("high_risk_class", ColType::StringWithDefault(String::new())),
            ("adherence", ColType::StringWithDefault(String::new())),
            ("anticholinergic_burden_points", ColType::IntegerNull),
            ("monitoring_required", ColType::StringWithDefault(String::new())),
            ("monitoring_up_to_date", ColType::StringWithDefault(String::new())),
            ("deprescribing_candidate", ColType::StringWithDefault(String::new())),
            ("stopp_criterion", ColType::TextWithDefault(String::new())),
            ("start_criterion", ColType::TextWithDefault(String::new())),
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
