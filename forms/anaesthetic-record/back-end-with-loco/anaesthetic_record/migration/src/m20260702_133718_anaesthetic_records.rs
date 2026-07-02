use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "anaesthetic_records",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("theatre", ColType::String),
            ("operation_date", ColType::DateNull),
            ("anaesthetist_name", ColType::String),
            ("assistant_name", ColType::String),
            ("surgeon_name", ColType::String),
            ("planned_procedure", ColType::Text),
            ("urgency", ColType::String),
            ("machine_checked", ColType::String),
            ("who_sign_in", ColType::String),
            ("who_time_out", ColType::String),
            ("consent_confirmed", ColType::String),
            ("fasting_confirmed", ColType::String),
            ("iv_access", ColType::Text),
            ("allergy_band_checked", ColType::String),
            ("documented_allergies", ColType::Text),
            ("asa_status", ColType::String),
            ("asa_emergency_modifier", ColType::String),
            ("mallampati_class", ColType::IntegerNull),
            ("mouth_opening_cm", ColType::DoubleNull),
            ("thyromental_distance_cm", ColType::DoubleNull),
            ("dentition", ColType::Text),
            ("anticipated_difficult_airway", ColType::String),
            ("prior_difficult_intubation", ColType::String),
            ("airway_technique", ColType::String),
            ("device_size", ColType::String),
            ("tube_depth_cm", ColType::DoubleNull),
            ("cuffed", ColType::String),
            ("cormack_lehane_grade", ColType::IntegerNull),
            ("intubation_attempts", ColType::IntegerNull),
            ("capnography_confirmed", ColType::String),
            ("monitoring_modalities", ColType::Text),
            ("anaesthetic_technique", ColType::String),
            ("crystalloid_ml", ColType::DoubleNull),
            ("colloid_ml", ColType::DoubleNull),
            ("blood_products_ml", ColType::DoubleNull),
            ("estimated_blood_loss_ml", ColType::DoubleNull),
            ("urine_output_ml", ColType::DoubleNull),
            ("cell_salvage_ml", ColType::DoubleNull),
            ("regional_technique", ColType::String),
            ("regional_level", ColType::String),
            ("regional_drug", ColType::String),
            ("regional_dose_mg", ColType::DoubleNull),
            ("block_height", ColType::String),
            ("regional_complications", ColType::Text),
            ("recovery_destination", ColType::String),
            ("handover_airway_status", ColType::Text),
            ("analgesia_plan", ColType::Text),
            ("antiemetic_plan", ColType::Text),
            ("oxygen_plan", ColType::Text),
            ("outstanding_tasks", ColType::Text),
            ("handover_at", ColType::TimestampWithTimeZoneNull),
            ("receiving_practitioner", ColType::String),
            ("anaesthetist_signature", ColType::Text),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "anaesthetic_records").await
    }
}
