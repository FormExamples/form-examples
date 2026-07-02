use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "newborn_and_infant_physical_examinations",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),

            ("practitioner_name", ColType::Text),
            ("practitioner_role", ColType::String),
            ("examined_at", ColType::TimestampWithTimeZoneNull),
            ("examination_context", ColType::String),
            ("care_setting", ColType::String),
            ("baby_identifier", ColType::String),
            ("baby_name", ColType::String),
            ("date_of_birth", ColType::DateNull),
            ("sex", ColType::String),
            ("gestational_age_weeks", ColType::DoubleNull),
            ("birth_weight_grams", ColType::DoubleNull),
            ("breech_presentation", ColType::String),
            ("family_history_hip_problems", ColType::String),
            ("antenatal_concerns", ColType::Text),
            ("eyes_red_reflex_right", ColType::String),
            ("eyes_red_reflex_left", ColType::String),
            ("eyes_appearance", ColType::String),
            ("heart_murmur", ColType::String),
            ("femoral_pulses_right", ColType::String),
            ("femoral_pulses_left", ColType::String),
            ("central_cyanosis", ColType::String),
            ("oxygen_saturation_preductal", ColType::DoubleNull),
            ("oxygen_saturation_postductal", ColType::DoubleNull),
            ("barlow_test", ColType::String),
            ("ortolani_test", ColType::String),
            ("hip_abduction", ColType::String),
            ("testis_right", ColType::String),
            ("testis_left", ColType::String),
            ("general_appearance", ColType::String),
            ("skin", ColType::String),
            ("head_and_fontanelles", ColType::String),
            ("face_and_palate", ColType::String),
            ("neck_and_clavicles", ColType::String),
            ("chest_and_lungs", ColType::String),
            ("abdomen", ColType::String),
            ("genitalia", ColType::String),
            ("anus_and_spine", ColType::String),
            ("limbs_and_digits", ColType::String),
            ("feet", ColType::String),
            ("tone_and_movement", ColType::String),
            ("weight_grams", ColType::DoubleNull),
            ("head_circumference_cm", ColType::DoubleNull),
            ("length_cm", ColType::DoubleNull),
            ("eyes_result_recorded", ColType::String),
            ("heart_result_recorded", ColType::String),
            ("hips_result_recorded", ColType::String),
            ("testes_result_recorded", ColType::String),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "newborn_and_infant_physical_examinations").await
    }
}
