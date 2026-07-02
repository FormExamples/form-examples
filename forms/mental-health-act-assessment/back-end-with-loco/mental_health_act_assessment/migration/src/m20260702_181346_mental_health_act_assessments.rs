use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "mental_health_act_assessments",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("location", ColType::String),
            ("referral_source", ColType::Text),
            ("reason_for_assessment", ColType::Text),
            ("person_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("first_language", ColType::Text),
            ("amhp_name", ColType::Text),
            ("amhp_approved", ColType::String),
            ("doctor1_name", ColType::Text),
            ("doctor1_gmc_number", ColType::Text),
            ("doctor1_section12_approved", ColType::String),
            ("doctor1_examined_at", ColType::TimestampWithTimeZoneNull),
            ("doctor2_name", ColType::Text),
            ("doctor2_gmc_number", ColType::Text),
            ("doctor2_section12_approved", ColType::String),
            ("doctor2_examined_at", ColType::TimestampWithTimeZoneNull),
            ("prior_acquaintance", ColType::String),
            ("mental_disorder_present", ColType::String),
            ("mental_disorder_evidence", ColType::Text),
            ("risk_to_own_health", ColType::String),
            ("risk_to_own_safety", ColType::String),
            ("risk_to_others", ColType::String),
            ("risk_evidence", ColType::Text),
            ("risk_imminence", ColType::String),
            ("least_restrictive_met", ColType::String),
            ("alternatives_considered", ColType::Text),
            ("appropriate_treatment_available", ColType::String),
            ("treatment_plan_summary", ColType::Text),
            ("nearest_relative_identified", ColType::String),
            ("nearest_relative_consulted", ColType::String),
            ("nearest_relative_objection", ColType::String),
            ("consultation_record", ColType::Text),
            ("recommended_section", ColType::String),
            ("outcome", ColType::String),
            ("bed_identified", ColType::String),
            ("conveyance", ColType::String),
            ("clinical_legal_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "mental_health_act_assessments").await
    }
}
