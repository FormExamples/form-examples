use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "abdominal_aortic_aneurysm_screenings",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("technician_name", ColType::Text),
            ("technician_role", ColType::String),
            ("clinic_site", ColType::Text),
            ("scanned_at", ColType::TimestampWithTimeZoneNull),
            ("device_identifier", ColType::Text),
            ("patient_identifier", ColType::String),
            ("age", ColType::IntegerNull),
            ("sex", ColType::String),
            ("eligibility_route", ColType::String),
            ("scan_type", ColType::String),
            ("consent_given", ColType::String),
            ("leaflet_provided", ColType::String),
            ("consent_note", ColType::Text),
            ("aorta_visualised", ColType::String),
            ("max_aortic_diameter_cm", ColType::DoubleNull),
            ("prior_max_diameter_cm", ColType::DoubleNull),
            ("prior_scan_date", ColType::DateNull),
            ("symptomatic", ColType::String),
            ("incidental_findings", ColType::Text),
            ("result_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "abdominal_aortic_aneurysm_screenings").await
    }
}
