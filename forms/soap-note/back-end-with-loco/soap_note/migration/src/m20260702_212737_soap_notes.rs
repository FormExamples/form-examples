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
            ("care_setting", ColType::String),
            ("encounter_type", ColType::String),
            ("clinician_role", ColType::String),
            ("patient_identifier", ColType::String),
            ("presenting_complaint", ColType::Text),
            ("history_of_presenting_complaint", ColType::Text),
            ("patient_reported_symptoms", ColType::Text),
            ("relevant_history", ColType::Text),
            ("red_flag_symptoms", ColType::String),
            ("examination_findings", ColType::Text),
            ("vital_signs", ColType::Text),
            ("abnormal_vitals_present", ColType::String),
            ("investigation_results", ColType::Text),
            ("primary_diagnosis", ColType::Text),
            ("problem_list", ColType::Text),
            ("differential", ColType::Text),
            ("clinical_impression", ColType::Text),
            ("investigations_plan", ColType::Text),
            ("treatment_plan", ColType::Text),
            ("referrals", ColType::Text),
            ("follow_up", ColType::Text),
            ("safety_netting", ColType::Text),
            ("managed_at_home", ColType::String),
            ("clinical_note", ColType::Text),
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
