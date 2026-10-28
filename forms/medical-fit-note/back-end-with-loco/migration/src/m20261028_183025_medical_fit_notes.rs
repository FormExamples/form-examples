use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_fit_notes", &[
            
            ("id", ColType::PkUuid),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("assessment_date", ColType::DateNull),
            ("assessment_method", ColType::StringWithDefault(String::new())),
            ("diagnosis_primary", ColType::StringWithDefault(String::new())),
            ("diagnosis_additional", ColType::StringWithDefault(String::new())),
            ("fitness_advice", ColType::StringWithDefault(String::new())),
            ("period_from", ColType::DateNull),
            ("period_to", ColType::DateNull),
            ("period_duration_days", ColType::IntegerNull),
            ("reassessment_required", ColType::StringWithDefault(String::new())),
            ("adjustment_phased_return", ColType::StringWithDefault(String::new())),
            ("adjustment_altered_hours", ColType::StringWithDefault(String::new())),
            ("adjustment_amended_duties", ColType::StringWithDefault(String::new())),
            ("adjustment_workplace_adaptations", ColType::StringWithDefault(String::new())),
            ("functional_effects", ColType::TextWithDefault(String::new())),
            ("comments", ColType::TextWithDefault(String::new())),
            ("employee_consent_to_share", ColType::StringWithDefault(String::new())),
            ("clinician_declaration", ColType::StringWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
("employee_id", ColType::Uuid),
("clinician_id", ColType::Uuid),
], &[("employee", "employee_id"), ("clinician", "clinician_id")]).await?;
m.get_connection().execute_unprepared("ALTER TABLE medical_fit_notes ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_fit_notes").await
    }
}
