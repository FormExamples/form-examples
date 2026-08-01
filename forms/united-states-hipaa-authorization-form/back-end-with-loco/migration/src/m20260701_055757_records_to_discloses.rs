use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "records_to_discloses",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("include_medical_health", ColType::StringWithDefault(String::new())),
            ("medical_health_initials", ColType::StringWithDefault(String::new())),
            ("include_mental_health", ColType::StringWithDefault(String::new())),
            ("mental_health_initials", ColType::StringWithDefault(String::new())),
            ("include_substance_use", ColType::StringWithDefault(String::new())),
            ("substance_use_initials", ColType::StringWithDefault(String::new())),
            ("part2_redisclosure_notice_included", ColType::StringWithDefault(String::new())),
            ("include_hiv_aids", ColType::StringWithDefault(String::new())),
            ("hiv_aids_initials", ColType::StringWithDefault(String::new())),
            ("hiv_aids_state_consent_included", ColType::StringWithDefault(String::new())),
            ("include_psychotherapy_notes", ColType::StringWithDefault(String::new())),
            ("include_genetic_information", ColType::StringWithDefault(String::new())),
            ("include_reproductive_health", ColType::StringWithDefault(String::new())),
            ("section_7332_notice_included", ColType::StringWithDefault(String::new())),
            ("date_range_specified", ColType::StringWithDefault(String::new())),
            ("date_from", ColType::DateNull),
            ("date_to", ColType::DateNull),
            ("other_description", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("hipaa_authorization", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "records_to_discloses").await
    }
}
