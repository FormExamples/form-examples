use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "pregnancy_ultrasound_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("last_menstrual_period_date", ColType::DateNull),
            ("last_menstrual_period_reliability", ColType::StringWithDefault(String::new())),
            ("estimated_due_date", ColType::DateNull),
            ("estimated_due_date_method", ColType::StringWithDefault(String::new())),
            ("gestational_age_weeks", ColType::IntegerNull),
            ("gestational_age_days", ColType::IntegerNull),
            ("gravida", ColType::IntegerNull),
            ("para", ColType::IntegerNull),
            ("plurality", ColType::StringWithDefault(String::new())),
            ("chorionicity", ColType::StringWithDefault(String::new())),
            ("conception_method", ColType::StringWithDefault(String::new())),
            ("rhesus_status", ColType::StringWithDefault(String::new())),
            ("body_mass_index", ColType::DoubleNull),
            ("requested_scan_type", ColType::StringWithDefault(String::new())),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_question", ColType::StringWithDefault(String::new())),
            ("relevant_history", ColType::StringWithDefault(String::new())),
            ("previous_scan_finding", ColType::StringWithDefault(String::new())),
            ("previous_scan_date", ColType::DateNull),
            ("vaginal_bleeding", ColType::StringWithDefault(String::new())),
            ("abdominal_pain", ColType::StringWithDefault(String::new())),
            ("reduced_fetal_movements", ColType::BooleanWithDefault(false)),
            ("suspected_ectopic", ColType::BooleanWithDefault(false)),
            ("haemodynamically_unstable", ColType::BooleanWithDefault(false)),
            ("hypertension", ColType::BooleanWithDefault(false)),
            ("diabetes", ColType::BooleanWithDefault(false)),
            ("previous_growth_restriction", ColType::BooleanWithDefault(false)),
            ("previous_preterm_birth", ColType::BooleanWithDefault(false)),
            ("previous_caesarean", ColType::BooleanWithDefault(false)),
            ("smoker", ColType::BooleanWithDefault(false)),
            ("urgency", ColType::StringWithDefault("routine".to_string())),
            ("supervising_consultant", ColType::StringWithDefault(String::new())),
            ("requester_contact", ColType::StringWithDefault(String::new())),
            ("interpreter_required", ColType::BooleanWithDefault(false)),
            ("notes", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "pregnancy_ultrasound_test_requests").await
    }
}
