use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "soap_notes",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("encountered_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("encounter_type", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("presenting_complaint", ColType::TextWithDefault(String::new())),
            ("history_of_presenting_complaint", ColType::TextWithDefault(String::new())),
            ("patient_reported_symptoms", ColType::TextWithDefault(String::new())),
            ("relevant_history", ColType::TextWithDefault(String::new())),
            ("red_flag_symptoms", ColType::StringWithDefault(String::new())),
            ("examination_findings", ColType::TextWithDefault(String::new())),
            ("vital_signs", ColType::TextWithDefault(String::new())),
            ("abnormal_vitals_present", ColType::StringWithDefault(String::new())),
            ("investigation_results", ColType::TextWithDefault(String::new())),
            ("primary_diagnosis", ColType::TextWithDefault(String::new())),
            ("problem_list", ColType::TextWithDefault(String::new())),
            ("differential", ColType::TextWithDefault(String::new())),
            ("clinical_impression", ColType::TextWithDefault(String::new())),
            ("investigations_plan", ColType::TextWithDefault(String::new())),
            ("treatment_plan", ColType::TextWithDefault(String::new())),
            ("referrals", ColType::TextWithDefault(String::new())),
            ("follow_up", ColType::TextWithDefault(String::new())),
            ("safety_netting", ColType::TextWithDefault(String::new())),
            ("managed_at_home", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "soap_notes").await
    }
}
