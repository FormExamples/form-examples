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

            ("practitioner_name", ColType::TextWithDefault(String::new())),
            ("practitioner_role", ColType::StringWithDefault(String::new())),
            ("examined_at", ColType::TimestampWithTimeZoneNull),
            ("examination_context", ColType::StringWithDefault(String::new())),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("baby_identifier", ColType::StringWithDefault(String::new())),
            ("baby_name", ColType::StringWithDefault(String::new())),
            ("date_of_birth", ColType::DateNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("gestational_age_weeks", ColType::DoubleNull),
            ("birth_weight_grams", ColType::DoubleNull),
            ("breech_presentation", ColType::StringWithDefault(String::new())),
            ("family_history_hip_problems", ColType::StringWithDefault(String::new())),
            ("antenatal_concerns", ColType::TextWithDefault(String::new())),
            ("eyes_red_reflex_right", ColType::StringWithDefault(String::new())),
            ("eyes_red_reflex_left", ColType::StringWithDefault(String::new())),
            ("eyes_appearance", ColType::StringWithDefault(String::new())),
            ("heart_murmur", ColType::StringWithDefault(String::new())),
            ("femoral_pulses_right", ColType::StringWithDefault(String::new())),
            ("femoral_pulses_left", ColType::StringWithDefault(String::new())),
            ("central_cyanosis", ColType::StringWithDefault(String::new())),
            ("oxygen_saturation_preductal", ColType::DoubleNull),
            ("oxygen_saturation_postductal", ColType::DoubleNull),
            ("barlow_test", ColType::StringWithDefault(String::new())),
            ("ortolani_test", ColType::StringWithDefault(String::new())),
            ("hip_abduction", ColType::StringWithDefault(String::new())),
            ("testis_right", ColType::StringWithDefault(String::new())),
            ("testis_left", ColType::StringWithDefault(String::new())),
            ("general_appearance", ColType::StringWithDefault(String::new())),
            ("skin", ColType::StringWithDefault(String::new())),
            ("head_and_fontanelles", ColType::StringWithDefault(String::new())),
            ("face_and_palate", ColType::StringWithDefault(String::new())),
            ("neck_and_clavicles", ColType::StringWithDefault(String::new())),
            ("chest_and_lungs", ColType::StringWithDefault(String::new())),
            ("abdomen", ColType::StringWithDefault(String::new())),
            ("genitalia", ColType::StringWithDefault(String::new())),
            ("anus_and_spine", ColType::StringWithDefault(String::new())),
            ("limbs_and_digits", ColType::StringWithDefault(String::new())),
            ("feet", ColType::StringWithDefault(String::new())),
            ("tone_and_movement", ColType::StringWithDefault(String::new())),
            ("weight_grams", ColType::DoubleNull),
            ("head_circumference_cm", ColType::DoubleNull),
            ("length_cm", ColType::DoubleNull),
            ("eyes_result_recorded", ColType::StringWithDefault(String::new())),
            ("heart_result_recorded", ColType::StringWithDefault(String::new())),
            ("hips_result_recorded", ColType::StringWithDefault(String::new())),
            ("testes_result_recorded", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
