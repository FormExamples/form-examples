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
            ("status", ColType::StringWithDefault("not-started".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("operating_room", ColType::StringWithDefault(String::new())),
            ("case_date", ColType::DateNull),
            ("case_start_at", ColType::TimestampWithTimeZoneNull),
            ("case_end_at", ColType::TimestampWithTimeZoneNull),
            ("planned_procedure", ColType::StringWithDefault(String::new())),
            ("surgical_specialty", ColType::StringWithDefault(String::new())),
            ("urgency", ColType::StringWithDefault(String::new())),
            ("laterality", ColType::StringWithDefault(String::new())),
            ("is_paediatric", ColType::StringWithDefault(String::new())),
            ("abandoned_reason", ColType::StringWithDefault(String::new())),
            ("sign_in_identity_site_procedure_consent", ColType::StringWithDefault(String::new())),
            ("sign_in_site_marked", ColType::StringWithDefault(String::new())),
            ("sign_in_anaesthesia_check_complete", ColType::StringWithDefault(String::new())),
            ("sign_in_pulse_oximeter_on_patient", ColType::StringWithDefault(String::new())),
            ("sign_in_known_allergy", ColType::StringWithDefault(String::new())),
            ("sign_in_known_allergy_detail", ColType::StringWithDefault(String::new())),
            ("sign_in_difficult_airway_aspiration_risk", ColType::StringWithDefault(String::new())),
            ("sign_in_blood_loss_risk", ColType::StringWithDefault(String::new())),
            ("sign_in_completed_at", ColType::TimestampWithTimeZoneNull),
            ("time_out_team_introductions_confirmed", ColType::StringWithDefault(String::new())),
            ("time_out_patient_procedure_incision_confirmed", ColType::StringWithDefault(String::new())),
            ("time_out_antibiotic_prophylaxis_within_60min", ColType::StringWithDefault(String::new())),
            ("time_out_surgeon_critical_steps", ColType::StringWithDefault(String::new())),
            ("time_out_surgeon_case_duration_minutes", ColType::IntegerNull),
            ("time_out_surgeon_anticipated_blood_loss_ml", ColType::IntegerNull),
            ("time_out_anaesthetist_patient_concerns", ColType::StringWithDefault(String::new())),
            ("time_out_nursing_sterility_confirmed", ColType::StringWithDefault(String::new())),
            ("time_out_nursing_equipment_concerns", ColType::StringWithDefault(String::new())),
            ("time_out_essential_imaging_displayed", ColType::StringWithDefault(String::new())),
            ("time_out_completed_at", ColType::TimestampWithTimeZoneNull),
            ("sign_out_procedure_name_confirmed", ColType::StringWithDefault(String::new())),
            ("sign_out_counts_confirmed", ColType::StringWithDefault(String::new())),
            ("sign_out_specimens_labelled", ColType::StringWithDefault(String::new())),
            ("sign_out_equipment_problems", ColType::StringWithDefault(String::new())),
            ("sign_out_recovery_concerns", ColType::StringWithDefault(String::new())),
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
