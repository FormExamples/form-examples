use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "international_certificate_of_vaccination_or_prophylaxes",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("issued_at", ColType::TimestampWithTimeZoneNull),
            ("revoked_at", ColType::TimestampWithTimeZoneNull),
            ("revocation_reason", ColType::TextWithDefault(String::new())),
            ("certificate_serial_number", ColType::StringWithDefault(String::new())),
            ("issuing_country_as_iso_3166_1_alpha_3", ColType::StringWithDefault(String::new())),
            ("primary_language_as_bcp_47", ColType::StringWithDefault("en".to_string())),
            ("secondary_language_as_bcp_47", ColType::StringWithDefault("fr".to_string())),
            ("tertiary_language_as_bcp_47", ColType::StringWithDefault(String::new())),
            ("destination_countries_as_iso_3166_1_alpha_3", ColType::TextWithDefault(String::new())),
            ("planned_arrival_date", ColType::DateNull),
            ("purpose_of_travel", ColType::StringWithDefault(String::new())),
            ("medical_waiver", ColType::StringWithDefault(String::new())),
            ("medical_waiver_reason", ColType::TextWithDefault(String::new())),
            ("medical_waiver_signed_at", ColType::TimestampWithTimeZoneNull),
            ("declared_pregnancy", ColType::StringWithDefault(String::new())),
            ("declared_breastfeeding", ColType::StringWithDefault(String::new())),
            ("declared_immunosuppression", ColType::StringWithDefault(String::new())),
            ("electronic_signature_data_url", ColType::TextWithDefault(String::new())),
            ("electronic_signature_signed_at", ColType::TimestampWithTimeZoneNull),
            ("overall_valid", ColType::StringWithDefault(String::new())),
            ("validity_computed_at", ColType::TimestampWithTimeZoneNull),
            ("notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ("center", ""),
            ("clinician", "medical_waiver_signed_by_clinician_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "international_certificate_of_vaccination_or_prophylaxes").await
    }
}
