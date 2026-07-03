use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "who_surgical_safety_checklists",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("operating_room", ColType::String),
            ("case_date", ColType::DateNull),
            ("case_start_at", ColType::TimestampWithTimeZoneNull),
            ("case_end_at", ColType::TimestampWithTimeZoneNull),
            ("planned_procedure", ColType::String),
            ("surgical_specialty", ColType::String),
            ("urgency", ColType::String),
            ("laterality", ColType::String),
            ("is_paediatric", ColType::String),
            ("abandoned_reason", ColType::String),
            ("sign_in_identity_site_procedure_consent", ColType::String),
            ("sign_in_site_marked", ColType::String),
            ("sign_in_anaesthesia_check_complete", ColType::String),
            ("sign_in_pulse_oximeter_on_patient", ColType::String),
            ("sign_in_known_allergy", ColType::String),
            ("sign_in_known_allergy_detail", ColType::String),
            ("sign_in_difficult_airway_aspiration_risk", ColType::String),
            ("sign_in_blood_loss_risk", ColType::String),
            ("sign_in_completed_at", ColType::TimestampWithTimeZoneNull),
            ("time_out_team_introductions_confirmed", ColType::String),
            ("time_out_patient_procedure_incision_confirmed", ColType::String),
            ("time_out_antibiotic_prophylaxis_within_60min", ColType::String),
            ("time_out_surgeon_critical_steps", ColType::String),
            ("time_out_surgeon_case_duration_minutes", ColType::IntegerNull),
            ("time_out_surgeon_anticipated_blood_loss_ml", ColType::IntegerNull),
            ("time_out_anaesthetist_patient_concerns", ColType::String),
            ("time_out_nursing_sterility_confirmed", ColType::String),
            ("time_out_nursing_equipment_concerns", ColType::String),
            ("time_out_essential_imaging_displayed", ColType::String),
            ("time_out_completed_at", ColType::TimestampWithTimeZoneNull),
            ("sign_out_procedure_name_confirmed", ColType::String),
            ("sign_out_counts_confirmed", ColType::String),
            ("sign_out_specimens_labelled", ColType::String),
            ("sign_out_equipment_problems", ColType::String),
            ("sign_out_recovery_concerns", ColType::String),
            ("sign_out_completed_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("patient", ""),
            ("clinicians?", "surgeon_id"),
            ("clinicians?", "anaesthetist_id"),
            ("clinicians?", "lead_nurse_id"),
            ("clinicians?", "sign_in_coordinator_id"),
            ("clinicians?", "time_out_coordinator_id"),
            ("clinicians?", "sign_out_coordinator_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "who_surgical_safety_checklists").await
    }
}
