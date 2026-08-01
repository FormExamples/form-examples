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
            ("certifying_doctor_name", ColType::TextWithDefault(String::new())),
            ("certifying_doctor_grade", ColType::StringWithDefault(String::new())),
            ("gmc_reference", ColType::StringWithDefault(String::new())),
            ("place_of_certification", ColType::TextWithDefault(String::new())),
            ("certification_date", ColType::DateNull),
            ("attended_deceased", ColType::StringWithDefault(String::new())),
            ("last_seen_alive_date", ColType::DateNull),
            ("deceased_name", ColType::TextWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("date_of_birth", ColType::DateNull),
            ("age_years", ColType::IntegerNull),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("date_of_death", ColType::DateNull),
            ("time_of_death", ColType::StringNull),
            ("place_of_death", ColType::TextWithDefault(String::new())),
            ("seen_after_death_by", ColType::StringWithDefault(String::new())),
            ("cause_ia_condition", ColType::TextWithDefault(String::new())),
            ("cause_ia_interval", ColType::TextWithDefault(String::new())),
            ("cause_ib_condition", ColType::TextWithDefault(String::new())),
            ("cause_ib_interval", ColType::TextWithDefault(String::new())),
            ("cause_ic_condition", ColType::TextWithDefault(String::new())),
            ("cause_ic_interval", ColType::TextWithDefault(String::new())),
            ("part_ii_conditions", ColType::TextWithDefault(String::new())),
            ("part_ii_interval", ColType::TextWithDefault(String::new())),
            ("referred_to_coroner", ColType::StringWithDefault(String::new())),
            ("coroner_reason", ColType::StringWithDefault(String::new())),
            ("medical_examiner_status", ColType::StringWithDefault(String::new())),
            ("certifier_note", ColType::TextWithDefault(String::new())),
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
