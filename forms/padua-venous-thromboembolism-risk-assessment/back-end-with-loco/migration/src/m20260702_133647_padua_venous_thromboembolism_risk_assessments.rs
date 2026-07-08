use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "padua_venous_thromboembolism_risk_assessments",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("admission_reason", ColType::Text),
            ("patient_identifier", ColType::String),
            ("age_years", ColType::DoubleNull),
            ("sex", ColType::String),
            ("active_cancer", ColType::String),
            ("previous_vte", ColType::String),
            ("reduced_mobility", ColType::String),
            ("known_thrombophilia", ColType::String),
            ("recent_trauma_or_surgery", ColType::String),
            ("heart_or_respiratory_failure", ColType::String),
            ("acute_mi_or_ischaemic_stroke", ColType::String),
            ("acute_infection_or_rheumatological", ColType::String),
            ("body_mass_index", ColType::DoubleNull),
            ("ongoing_hormonal_treatment", ColType::String),
            ("active_bleeding", ColType::String),
            ("high_bleeding_risk", ColType::String),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "padua_venous_thromboembolism_risk_assessments").await
    }
}
