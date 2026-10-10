use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "abdominal_aortic_aneurysm_screenings",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("technician_name", ColType::TextWithDefault(String::new())),
                ("technician_role", ColType::StringWithDefault(String::new())),
                ("clinic_site", ColType::TextWithDefault(String::new())),
                ("scanned_at", ColType::TimestampWithTimeZoneNull),
                ("device_identifier", ColType::TextWithDefault(String::new())),
                (
                    "patient_identifier",
                    ColType::StringWithDefault(String::new()),
                ),
                ("age", ColType::IntegerNull),
                ("sex", ColType::StringWithDefault(String::new())),
                (
                    "eligibility_route",
                    ColType::StringWithDefault(String::new()),
                ),
                ("scan_type", ColType::StringWithDefault(String::new())),
                ("consent_given", ColType::StringWithDefault(String::new())),
                (
                    "leaflet_provided",
                    ColType::StringWithDefault(String::new()),
                ),
                ("consent_note", ColType::TextWithDefault(String::new())),
                (
                    "aorta_visualised",
                    ColType::StringWithDefault(String::new()),
                ),
                ("max_aortic_diameter_cm", ColType::DoubleNull),
                ("prior_max_diameter_cm", ColType::DoubleNull),
                ("prior_scan_date", ColType::DateNull),
                ("symptomatic", ColType::StringWithDefault(String::new())),
                (
                    "incidental_findings",
                    ColType::TextWithDefault(String::new()),
                ),
                ("result_note", ColType::TextWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE abdominal_aortic_aneurysm_screenings ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "abdominal_aortic_aneurysm_screenings").await
    }
}
