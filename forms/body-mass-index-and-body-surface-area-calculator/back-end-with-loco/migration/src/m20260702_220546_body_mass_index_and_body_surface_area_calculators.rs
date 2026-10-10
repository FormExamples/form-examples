use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "body_mass_index_and_body_surface_area_calculators",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("clinician_name", ColType::StringWithDefault(String::new())),
                ("clinician_role", ColType::StringWithDefault(String::new())),
                ("assessed_at", ColType::TimestampWithTimeZoneNull),
                ("care_setting", ColType::StringWithDefault(String::new())),
                ("purpose", ColType::StringWithDefault(String::new())),
                (
                    "patient_identifier",
                    ColType::StringWithDefault(String::new()),
                ),
                ("age_band", ColType::StringWithDefault(String::new())),
                ("sex", ColType::StringWithDefault(String::new())),
                ("ancestry", ColType::StringWithDefault(String::new())),
                ("height_cm", ColType::DoubleNull),
                ("weight_kg", ColType::DoubleNull),
                (
                    "bsa_formula",
                    ColType::StringWithDefault("mosteller".to_string()),
                ),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE body_mass_index_and_body_surface_area_calculators ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "body_mass_index_and_body_surface_area_calculators").await
    }
}
