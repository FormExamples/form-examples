use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "nursing_care_plans",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("nurse_name", ColType::Text),
            ("nurse_role", ColType::String),
            ("nmc_number", ColType::Text),
            ("authored_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("plan_type", ColType::String),
            ("model_used", ColType::String),
            ("patient_identifier", ColType::Text),
            ("patient_name", ColType::Text),
            ("date_of_birth", ColType::DateNull),
            ("sex", ColType::String),
            ("ward_location", ColType::Text),
            ("handover_note", ColType::Text),
            ("review_date", ColType::DateNull),
            ("falls_risk_done", ColType::String),
            ("falls_risk_level", ColType::String),
            ("falls_risk_assessed_on", ColType::DateNull),
            ("falls_risk_actioned", ColType::String),
            ("pressure_ulcer_risk_done", ColType::String),
            ("pressure_ulcer_risk_level", ColType::String),
            ("pressure_ulcer_risk_assessed_on", ColType::DateNull),
            ("pressure_ulcer_risk_actioned", ColType::String),
            ("vte_risk_done", ColType::String),
            ("vte_risk_level", ColType::String),
            ("vte_risk_assessed_on", ColType::DateNull),
            ("vte_risk_actioned", ColType::String),
            ("nutrition_risk_done", ColType::String),
            ("nutrition_risk_level", ColType::String),
            ("nutrition_risk_assessed_on", ColType::DateNull),
            ("nutrition_risk_actioned", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "nursing_care_plans").await
    }
}
