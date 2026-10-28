use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_device_assessments", &[
            
            ("id", ColType::PkUuid),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("assessment_date", ColType::DateNull),
            ("device_name", ColType::StringWithDefault(String::new())),
            ("model_or_catalogue_number", ColType::StringWithDefault(String::new())),
            ("unique_device_identifier", ColType::StringWithDefault(String::new())),
            ("intended_purpose", ColType::TextWithDefault(String::new())),
            ("intended_user", ColType::StringWithDefault(String::new())),
            ("target_jurisdiction", ColType::StringWithDefault(String::new())),
            ("is_in_vitro_diagnostic", ColType::StringWithDefault(String::new())),
            ("device_kind", ColType::StringWithDefault(String::new())),
            ("contact_duration", ColType::StringWithDefault(String::new())),
            ("body_site", ColType::StringWithDefault(String::new())),
            ("channels_or_stores_body_substances", ColType::StringWithDefault(String::new())),
            ("connected_to_active_device_class_iia_or_higher", ColType::StringWithDefault(String::new())),
            ("reusable_surgical_instrument", ColType::StringWithDefault(String::new())),
            ("active_therapeutic", ColType::StringWithDefault(String::new())),
            ("active_diagnostic", ColType::StringWithDefault(String::new())),
            ("administers_or_exchanges_energy", ColType::StringWithDefault(String::new())),
            ("energy_potentially_hazardous", ColType::StringWithDefault(String::new())),
            ("administers_or_removes_medicinal_substances", ColType::StringWithDefault(String::new())),
            ("administration_potentially_hazardous", ColType::StringWithDefault(String::new())),
            ("monitors_vital_physiological_parameters", ColType::StringWithDefault(String::new())),
            ("closed_loop_therapy", ColType::StringWithDefault(String::new())),
            ("software_purpose", ColType::StringWithDefault(String::new())),
            ("software_worst_case_harm", ColType::StringWithDefault(String::new())),
            ("contains_medicinal_substance", ColType::StringWithDefault(String::new())),
            ("contains_human_or_animal_tissue", ColType::StringWithDefault(String::new())),
            ("contains_nanomaterial_with_high_exposure_potential", ColType::StringWithDefault(String::new())),
            ("composed_of_absorbed_substances", ColType::StringWithDefault(String::new())),
            ("contraception_or_sti_prevention", ColType::StringWithDefault(String::new())),
            ("disinfects_or_cleans_devices", ColType::StringWithDefault(String::new())),
            ("supplied_sterile", ColType::StringWithDefault(String::new())),
            ("has_measuring_function", ColType::StringWithDefault(String::new())),
            ("clinical_evidence_status", ColType::StringWithDefault(String::new())),
            ("risk_management_file_iso_14971", ColType::StringWithDefault(String::new())),
            ("quality_management_system_iso_13485", ColType::StringWithDefault(String::new())),
            ("cybersecurity_assessment_done", ColType::StringWithDefault(String::new())),
            ("post_market_surveillance_plan", ColType::StringWithDefault(String::new())),
            ("unique_device_identifier_assigned", ColType::StringWithDefault(String::new())),
            ("assessor_notes", ColType::TextWithDefault(String::new())),
("manufacturer_id", ColType::Uuid),
("assessor_id", ColType::Uuid),
], &[("manufacturer", "manufacturer_id"), ("assessor", "assessor_id")]).await?;
m.get_connection().execute_unprepared("ALTER TABLE medical_device_assessments ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_device_assessments").await
    }
}
