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
            ("location", ColType::StringWithDefault(String::new())),
            ("referral_source", ColType::TextWithDefault(String::new())),
            ("reason_for_assessment", ColType::TextWithDefault(String::new())),
            ("person_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("first_language", ColType::TextWithDefault(String::new())),
            ("amhp_name", ColType::TextWithDefault(String::new())),
            ("amhp_approved", ColType::StringWithDefault(String::new())),
            ("doctor1_name", ColType::TextWithDefault(String::new())),
            ("doctor1_gmc_number", ColType::TextWithDefault(String::new())),
            ("doctor1_section12_approved", ColType::StringWithDefault(String::new())),
            ("doctor1_examined_at", ColType::TimestampWithTimeZoneNull),
            ("doctor2_name", ColType::TextWithDefault(String::new())),
            ("doctor2_gmc_number", ColType::TextWithDefault(String::new())),
            ("doctor2_section12_approved", ColType::StringWithDefault(String::new())),
            ("doctor2_examined_at", ColType::TimestampWithTimeZoneNull),
            ("prior_acquaintance", ColType::StringWithDefault(String::new())),
            ("mental_disorder_present", ColType::StringWithDefault(String::new())),
            ("mental_disorder_evidence", ColType::TextWithDefault(String::new())),
            ("risk_to_own_health", ColType::StringWithDefault(String::new())),
            ("risk_to_own_safety", ColType::StringWithDefault(String::new())),
            ("risk_to_others", ColType::StringWithDefault(String::new())),
            ("risk_evidence", ColType::TextWithDefault(String::new())),
            ("risk_imminence", ColType::StringWithDefault(String::new())),
            ("least_restrictive_met", ColType::StringWithDefault(String::new())),
            ("alternatives_considered", ColType::TextWithDefault(String::new())),
            ("appropriate_treatment_available", ColType::StringWithDefault(String::new())),
            ("treatment_plan_summary", ColType::TextWithDefault(String::new())),
            ("nearest_relative_identified", ColType::StringWithDefault(String::new())),
            ("nearest_relative_consulted", ColType::StringWithDefault(String::new())),
            ("nearest_relative_objection", ColType::StringWithDefault(String::new())),
            ("consultation_record", ColType::TextWithDefault(String::new())),
            ("recommended_section", ColType::StringWithDefault(String::new())),
            ("outcome", ColType::StringWithDefault(String::new())),
            ("bed_identified", ColType::StringWithDefault(String::new())),
            ("conveyance", ColType::StringWithDefault(String::new())),
            ("clinical_legal_note", ColType::TextWithDefault(String::new())),
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
