use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "blood_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("full_blood_count", ColType::Boolean),
            ("urea_electrolytes", ColType::Boolean),
            ("liver_function", ColType::Boolean),
            ("thyroid_function", ColType::Boolean),
            ("hba1c", ColType::Boolean),
            ("lipid_profile", ColType::Boolean),
            ("c_reactive_protein", ColType::Boolean),
            ("coagulation_screen", ColType::Boolean),
            ("bone_profile", ColType::Boolean),
            ("ferritin_iron", ColType::Boolean),
            ("vitamin_b12_folate", ColType::Boolean),
            ("vitamin_d", ColType::Boolean),
            ("hba1c_monitoring", ColType::Boolean),
            ("glucose", ColType::Boolean),
            ("inr", ColType::Boolean),
            ("blood_culture", ColType::Boolean),
            ("group_and_save", ColType::Boolean),
            ("crossmatch", ColType::Boolean),
            ("troponin", ColType::Boolean),
            ("d_dimer", ColType::Boolean),
            ("amylase_lipase", ColType::Boolean),
            ("primary_indication", ColType::String),
            ("clinical_details", ColType::String),
            ("relevant_medications", ColType::String),
            ("fasting_required", ColType::Boolean),
            ("fasting_status", ColType::String),
            ("specimen_collected", ColType::String),
            ("collection_datetime", ColType::TimestampWithTimeZoneNull),
            ("known_blood_borne_virus", ColType::Boolean),
            ("difficult_venous_access", ColType::Boolean),
            ("urgency", ColType::String),
            ("supervising_consultant", ColType::String),
            ("requester_contact", ColType::String),
            ("notes", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "blood_test_requests").await
    }
}
