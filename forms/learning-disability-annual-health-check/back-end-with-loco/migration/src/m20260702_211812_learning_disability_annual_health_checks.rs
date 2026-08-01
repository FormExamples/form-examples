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
            
            ("clinician_name", ColType::TextWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("checked_on", ColType::DateNull),
            ("practice_name", ColType::TextWithDefault(String::new())),
            ("easy_read_invitation_sent", ColType::StringWithDefault(String::new())),
            ("pre_check_done", ColType::StringWithDefault(String::new())),
            ("person_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("ld_register_status", ColType::StringWithDefault(String::new())),
            ("main_carer", ColType::TextWithDefault(String::new())),
            ("communication_needs", ColType::TextWithDefault(String::new())),
            ("reasonable_adjustments_recorded", ColType::StringWithDefault(String::new())),
            ("health_passport", ColType::StringWithDefault(String::new())),
            ("consent_capacity_note", ColType::TextWithDefault(String::new())),
            ("weight_bmi_status", ColType::StringWithDefault(String::new())),
            ("bmi", ColType::DoubleNull),
            ("blood_pressure_status", ColType::StringWithDefault(String::new())),
            ("epilepsy_status", ColType::StringWithDefault(String::new())),
            ("constipation_status", ColType::StringWithDefault(String::new())),
            ("dysphagia_status", ColType::StringWithDefault(String::new())),
            ("continence_status", ColType::StringWithDefault(String::new())),
            ("mobility_falls_status", ColType::StringWithDefault(String::new())),
            ("dental_status", ColType::StringWithDefault(String::new())),
            ("vision_status", ColType::StringWithDefault(String::new())),
            ("hearing_status", ColType::StringWithDefault(String::new())),
            ("foot_health_status", ColType::StringWithDefault(String::new())),
            ("skin_status", ColType::StringWithDefault(String::new())),
            ("physical_health_actions", ColType::TextWithDefault(String::new())),
            ("cancer_screening_status", ColType::StringWithDefault(String::new())),
            ("other_screening_status", ColType::StringWithDefault(String::new())),
            ("immunisation_status", ColType::StringWithDefault(String::new())),
            ("medication_reconciled", ColType::StringWithDefault(String::new())),
            ("psychotropic_prescribed", ColType::StringWithDefault(String::new())),
            ("psychotropic_indication", ColType::TextWithDefault(String::new())),
            ("psychotropic_last_reviewed", ColType::DateNull),
            ("stomp_discussed", ColType::StringWithDefault(String::new())),
            ("medication_side_effects", ColType::TextWithDefault(String::new())),
            ("mental_health_status", ColType::StringWithDefault(String::new())),
            ("behaviour_status", ColType::StringWithDefault(String::new())),
            ("behaviour_triggers", ColType::TextWithDefault(String::new())),
            ("syndrome_specific_status", ColType::StringWithDefault(String::new())),
            ("carer_needs_status", ColType::StringWithDefault(String::new())),
            ("social_circumstances", ColType::TextWithDefault(String::new())),
            ("health_action_plan_produced", ColType::StringWithDefault(String::new())),
            ("health_action_plan_shared", ColType::StringWithDefault(String::new())),
            ("health_action_plan_actions", ColType::TextWithDefault(String::new())),
            ("clinician_note", ColType::TextWithDefault(String::new())),
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
