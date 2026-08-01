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
            ("nurse_name", ColType::TextWithDefault(String::new())),
            ("nurse_role", ColType::StringWithDefault(String::new())),
            ("nmc_number", ColType::TextWithDefault(String::new())),
            ("authored_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("plan_type", ColType::StringWithDefault(String::new())),
            ("model_used", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::TextWithDefault(String::new())),
            ("patient_name", ColType::TextWithDefault(String::new())),
            ("date_of_birth", ColType::DateNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("ward_location", ColType::TextWithDefault(String::new())),
            ("handover_note", ColType::TextWithDefault(String::new())),
            ("review_date", ColType::DateNull),
            ("falls_risk_done", ColType::StringWithDefault(String::new())),
            ("falls_risk_level", ColType::StringWithDefault(String::new())),
            ("falls_risk_assessed_on", ColType::DateNull),
            ("falls_risk_actioned", ColType::StringWithDefault(String::new())),
            ("pressure_ulcer_risk_done", ColType::StringWithDefault(String::new())),
            ("pressure_ulcer_risk_level", ColType::StringWithDefault(String::new())),
            ("pressure_ulcer_risk_assessed_on", ColType::DateNull),
            ("pressure_ulcer_risk_actioned", ColType::StringWithDefault(String::new())),
            ("vte_risk_done", ColType::StringWithDefault(String::new())),
            ("vte_risk_level", ColType::StringWithDefault(String::new())),
            ("vte_risk_assessed_on", ColType::DateNull),
            ("vte_risk_actioned", ColType::StringWithDefault(String::new())),
            ("nutrition_risk_done", ColType::StringWithDefault(String::new())),
            ("nutrition_risk_level", ColType::StringWithDefault(String::new())),
            ("nutrition_risk_assessed_on", ColType::DateNull),
            ("nutrition_risk_actioned", ColType::StringWithDefault(String::new())),
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
