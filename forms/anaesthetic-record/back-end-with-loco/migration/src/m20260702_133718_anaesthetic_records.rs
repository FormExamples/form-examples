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
            ("theatre", ColType::StringWithDefault(String::new())),
            ("operation_date", ColType::DateNull),
            ("anaesthetist_name", ColType::StringWithDefault(String::new())),
            ("assistant_name", ColType::StringWithDefault(String::new())),
            ("surgeon_name", ColType::StringWithDefault(String::new())),
            ("planned_procedure", ColType::TextWithDefault(String::new())),
            ("urgency", ColType::StringWithDefault(String::new())),
            ("machine_checked", ColType::StringWithDefault(String::new())),
            ("who_sign_in", ColType::StringWithDefault(String::new())),
            ("who_time_out", ColType::StringWithDefault(String::new())),
            ("consent_confirmed", ColType::StringWithDefault(String::new())),
            ("fasting_confirmed", ColType::StringWithDefault(String::new())),
            ("iv_access", ColType::TextWithDefault(String::new())),
            ("allergy_band_checked", ColType::StringWithDefault(String::new())),
            ("documented_allergies", ColType::TextWithDefault(String::new())),
            ("asa_status", ColType::StringWithDefault(String::new())),
            ("asa_emergency_modifier", ColType::StringWithDefault(String::new())),
            ("mallampati_class", ColType::IntegerNull),
            ("mouth_opening_cm", ColType::DoubleNull),
            ("thyromental_distance_cm", ColType::DoubleNull),
            ("dentition", ColType::TextWithDefault(String::new())),
            ("anticipated_difficult_airway", ColType::StringWithDefault(String::new())),
            ("prior_difficult_intubation", ColType::StringWithDefault(String::new())),
            ("airway_technique", ColType::StringWithDefault(String::new())),
            ("device_size", ColType::StringWithDefault(String::new())),
            ("tube_depth_cm", ColType::DoubleNull),
            ("cuffed", ColType::StringWithDefault(String::new())),
            ("cormack_lehane_grade", ColType::IntegerNull),
            ("intubation_attempts", ColType::IntegerNull),
            ("capnography_confirmed", ColType::StringWithDefault(String::new())),
            ("monitoring_modalities", ColType::TextWithDefault(String::new())),
            ("anaesthetic_technique", ColType::StringWithDefault(String::new())),
            ("crystalloid_ml", ColType::DoubleNull),
            ("colloid_ml", ColType::DoubleNull),
            ("blood_products_ml", ColType::DoubleNull),
            ("estimated_blood_loss_ml", ColType::DoubleNull),
            ("urine_output_ml", ColType::DoubleNull),
            ("cell_salvage_ml", ColType::DoubleNull),
            ("regional_technique", ColType::StringWithDefault(String::new())),
            ("regional_level", ColType::StringWithDefault(String::new())),
            ("regional_drug", ColType::StringWithDefault(String::new())),
            ("regional_dose_mg", ColType::DoubleNull),
            ("block_height", ColType::StringWithDefault(String::new())),
            ("regional_complications", ColType::TextWithDefault(String::new())),
            ("recovery_destination", ColType::StringWithDefault(String::new())),
            ("handover_airway_status", ColType::TextWithDefault(String::new())),
            ("analgesia_plan", ColType::TextWithDefault(String::new())),
            ("antiemetic_plan", ColType::TextWithDefault(String::new())),
            ("oxygen_plan", ColType::TextWithDefault(String::new())),
            ("outstanding_tasks", ColType::TextWithDefault(String::new())),
            ("handover_at", ColType::TimestampWithTimeZoneNull),
            ("receiving_practitioner", ColType::StringWithDefault(String::new())),
            ("anaesthetist_signature", ColType::TextWithDefault(String::new())),
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
