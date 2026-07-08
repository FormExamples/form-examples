use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_certificate_of_cause_of_deaths",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("certifying_doctor_name", ColType::Text),
            ("certifying_doctor_grade", ColType::String),
            ("gmc_reference", ColType::String),
            ("place_of_certification", ColType::Text),
            ("certification_date", ColType::DateNull),
            ("attended_deceased", ColType::String),
            ("last_seen_alive_date", ColType::DateNull),
            ("deceased_name", ColType::Text),
            ("sex", ColType::String),
            ("date_of_birth", ColType::DateNull),
            ("age_years", ColType::IntegerNull),
            ("patient_identifier", ColType::String),
            ("date_of_death", ColType::DateNull),
            ("time_of_death", ColType::StringNull),
            ("place_of_death", ColType::Text),
            ("seen_after_death_by", ColType::String),
            ("cause_ia_condition", ColType::Text),
            ("cause_ia_interval", ColType::Text),
            ("cause_ib_condition", ColType::Text),
            ("cause_ib_interval", ColType::Text),
            ("cause_ic_condition", ColType::Text),
            ("cause_ic_interval", ColType::Text),
            ("part_ii_conditions", ColType::Text),
            ("part_ii_interval", ColType::Text),
            ("referred_to_coroner", ColType::String),
            ("coroner_reason", ColType::String),
            ("medical_examiner_status", ColType::String),
            ("certifier_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_certificate_of_cause_of_deaths").await
    }
}
