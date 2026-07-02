use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "learning_disability_annual_health_checks",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::Text),
            ("clinician_role", ColType::String),
            ("checked_on", ColType::DateNull),
            ("practice_name", ColType::Text),
            ("easy_read_invitation_sent", ColType::String),
            ("pre_check_done", ColType::String),
            ("person_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("ld_register_status", ColType::String),
            ("main_carer", ColType::Text),
            ("communication_needs", ColType::Text),
            ("reasonable_adjustments_recorded", ColType::String),
            ("health_passport", ColType::String),
            ("consent_capacity_note", ColType::Text),
            ("weight_bmi_status", ColType::String),
            ("bmi", ColType::DoubleNull),
            ("blood_pressure_status", ColType::String),
            ("epilepsy_status", ColType::String),
            ("constipation_status", ColType::String),
            ("dysphagia_status", ColType::String),
            ("continence_status", ColType::String),
            ("mobility_falls_status", ColType::String),
            ("dental_status", ColType::String),
            ("vision_status", ColType::String),
            ("hearing_status", ColType::String),
            ("foot_health_status", ColType::String),
            ("skin_status", ColType::String),
            ("physical_health_actions", ColType::Text),
            ("cancer_screening_status", ColType::String),
            ("other_screening_status", ColType::String),
            ("immunisation_status", ColType::String),
            ("medication_reconciled", ColType::String),
            ("psychotropic_prescribed", ColType::String),
            ("psychotropic_indication", ColType::Text),
            ("psychotropic_last_reviewed", ColType::DateNull),
            ("stomp_discussed", ColType::String),
            ("medication_side_effects", ColType::Text),
            ("mental_health_status", ColType::String),
            ("behaviour_status", ColType::String),
            ("behaviour_triggers", ColType::Text),
            ("syndrome_specific_status", ColType::String),
            ("carer_needs_status", ColType::String),
            ("social_circumstances", ColType::Text),
            ("health_action_plan_produced", ColType::String),
            ("health_action_plan_shared", ColType::String),
            ("health_action_plan_actions", ColType::Text),
            ("clinician_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "learning_disability_annual_health_checks").await
    }
}
