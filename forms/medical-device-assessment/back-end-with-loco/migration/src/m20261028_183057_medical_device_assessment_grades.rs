use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_device_assessment_grades", &[
            
            ("id", ColType::PkUuid),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("computed_device_class", ColType::StringWithDefault(String::new())),
            ("final_device_class", ColType::StringWithDefault(String::new())),
            ("class_suffix", ColType::StringWithDefault(String::new())),
            ("override_reason", ColType::StringWithDefault(String::new())),
            ("conformity_route", ColType::StringWithDefault(String::new())),
            ("determining_rule", ColType::StringWithDefault(String::new())),
            ("regulatory_readiness", ColType::StringWithDefault(String::new())),
            ("assessor_notes", ColType::TextWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
("medical_device_assessment_id", ColType::Uuid),
], &[("medical_device_assessment", "medical_device_assessment_id")]).await?;
m.get_connection().execute_unprepared("ALTER TABLE medical_device_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_device_assessment_grades").await
    }
}
