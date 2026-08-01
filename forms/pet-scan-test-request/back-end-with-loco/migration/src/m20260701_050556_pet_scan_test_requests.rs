use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "pet_scan_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("scan_type", ColType::StringWithDefault(String::new())),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_question", ColType::StringWithDefault(String::new())),
            ("relevant_history", ColType::StringWithDefault(String::new())),
            ("primary_tumour_site", ColType::StringWithDefault(String::new())),
            ("diabetes", ColType::BooleanWithDefault(false)),
            ("blood_glucose_mmol_l", ColType::DoubleNull),
            ("pregnancy_status", ColType::StringWithDefault(String::new())),
            ("breastfeeding", ColType::BooleanWithDefault(false)),
            ("egfr", ColType::DoubleNull),
            ("recent_chemo_radiotherapy", ColType::StringWithDefault(String::new())),
            ("claustrophobia", ColType::BooleanWithDefault(false)),
            ("weight_kg", ColType::DoubleNull),
            ("urgency", ColType::StringWithDefault("routine".to_string())),
            ("ir_me_r_justification", ColType::StringWithDefault(String::new())),
            ("supervising_consultant", ColType::StringWithDefault(String::new())),
            ("requester_contact", ColType::StringWithDefault(String::new())),
            ("notes", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "pet_scan_test_requests").await
    }
}
