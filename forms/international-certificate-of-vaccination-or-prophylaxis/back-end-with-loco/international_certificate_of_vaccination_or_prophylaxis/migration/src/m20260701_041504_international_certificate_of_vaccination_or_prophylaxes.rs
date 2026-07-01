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
            ("status", ColType::String),
            ("issued_at", ColType::TimestampWithTimeZoneNull),
            ("revoked_at", ColType::TimestampWithTimeZoneNull),
            ("revocation_reason", ColType::Text),
            ("certificate_serial_number", ColType::String),
            ("issuing_country_as_iso_3166_1_alpha_3", ColType::String),
            ("primary_language_as_bcp_47", ColType::String),
            ("secondary_language_as_bcp_47", ColType::String),
            ("tertiary_language_as_bcp_47", ColType::String),
            ("destination_countries_as_iso_3166_1_alpha_3", ColType::Text),
            ("planned_arrival_date", ColType::DateNull),
            ("purpose_of_travel", ColType::String),
            ("medical_waiver", ColType::String),
            ("medical_waiver_reason", ColType::Text),
            ("medical_waiver_signed_at", ColType::TimestampWithTimeZoneNull),
            ("declared_pregnancy", ColType::String),
            ("declared_breastfeeding", ColType::String),
            ("declared_immunosuppression", ColType::String),
            ("electronic_signature_data_url", ColType::Text),
            ("electronic_signature_signed_at", ColType::TimestampWithTimeZoneNull),
            ("overall_valid", ColType::String),
            ("validity_computed_at", ColType::TimestampWithTimeZoneNull),
            ("notes", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ("center", ""),
            ("medical_waiver_signed_by_clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "international_certificate_of_vaccination_or_prophylaxes").await
    }
}
