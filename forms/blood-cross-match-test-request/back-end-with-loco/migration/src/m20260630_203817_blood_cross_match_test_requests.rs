use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "blood_cross_match_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("request_type", ColType::StringWithDefault(String::new())),
            ("component", ColType::StringWithDefault(String::new())),
            ("units_required", ColType::IntegerNull),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_details", ColType::StringWithDefault(String::new())),
            ("patient_blood_group", ColType::StringWithDefault(String::new())),
            ("known_antibodies", ColType::BooleanWithDefault(false)),
            ("antibody_detail", ColType::StringWithDefault(String::new())),
            ("previous_transfusion", ColType::BooleanWithDefault(false)),
            ("previous_transfusion_reaction", ColType::BooleanWithDefault(false)),
            ("pregnant", ColType::BooleanWithDefault(false)),
            ("sample_collected", ColType::StringWithDefault(String::new())),
            ("collection_datetime", ColType::TimestampWithTimeZoneNull),
            ("two_sample_rule_met", ColType::BooleanWithDefault(false)),
            ("required_by_datetime", ColType::TimestampWithTimeZoneNull),
            ("urgency", ColType::StringWithDefault("routine".to_string())),
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
        drop_table(m, "blood_cross_match_test_requests").await
    }
}
