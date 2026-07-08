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
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("last_menstrual_period_date", ColType::DateNull),
            ("last_menstrual_period_reliability", ColType::String),
            ("estimated_due_date", ColType::DateNull),
            ("estimated_due_date_method", ColType::String),
            ("gestational_age_weeks", ColType::IntegerNull),
            ("gestational_age_days", ColType::IntegerNull),
            ("gravida", ColType::IntegerNull),
            ("para", ColType::IntegerNull),
            ("plurality", ColType::String),
            ("chorionicity", ColType::String),
            ("conception_method", ColType::String),
            ("rhesus_status", ColType::String),
            ("body_mass_index", ColType::DoubleNull),
            ("requested_scan_type", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("previous_scan_finding", ColType::String),
            ("previous_scan_date", ColType::DateNull),
            ("vaginal_bleeding", ColType::String),
            ("abdominal_pain", ColType::String),
            ("reduced_fetal_movements", ColType::Boolean),
            ("suspected_ectopic", ColType::Boolean),
            ("haemodynamically_unstable", ColType::Boolean),
            ("hypertension", ColType::Boolean),
            ("diabetes", ColType::Boolean),
            ("previous_growth_restriction", ColType::Boolean),
            ("previous_preterm_birth", ColType::Boolean),
            ("previous_caesarean", ColType::Boolean),
            ("smoker", ColType::Boolean),
            ("urgency", ColType::String),
            ("supervising_consultant", ColType::String),
            ("requester_contact", ColType::String),
            ("interpreter_required", ColType::Boolean),
            ("notes", ColType::String),
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
