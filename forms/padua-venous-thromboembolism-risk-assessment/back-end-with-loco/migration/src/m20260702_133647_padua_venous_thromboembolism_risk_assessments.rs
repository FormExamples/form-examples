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
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("admission_reason", ColType::TextWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_years", ColType::DoubleNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("active_cancer", ColType::StringWithDefault(String::new())),
            ("previous_vte", ColType::StringWithDefault(String::new())),
            ("reduced_mobility", ColType::StringWithDefault(String::new())),
            ("known_thrombophilia", ColType::StringWithDefault(String::new())),
            ("recent_trauma_or_surgery", ColType::StringWithDefault(String::new())),
            ("heart_or_respiratory_failure", ColType::StringWithDefault(String::new())),
            ("acute_mi_or_ischaemic_stroke", ColType::StringWithDefault(String::new())),
            ("acute_infection_or_rheumatological", ColType::StringWithDefault(String::new())),
            ("body_mass_index", ColType::DoubleNull),
            ("ongoing_hormonal_treatment", ColType::StringWithDefault(String::new())),
            ("active_bleeding", ColType::StringWithDefault(String::new())),
            ("high_bleeding_risk", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
