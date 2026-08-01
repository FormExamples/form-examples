use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "caprini_venous_thromboembolism_risk_assessments",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("admission_type", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("minor_surgery", ColType::StringWithDefault(String::new())),
            ("recent_major_surgery", ColType::StringWithDefault(String::new())),
            ("varicose_veins", ColType::StringWithDefault(String::new())),
            ("inflammatory_bowel_disease", ColType::StringWithDefault(String::new())),
            ("swollen_legs", ColType::StringWithDefault(String::new())),
            ("obesity", ColType::StringWithDefault(String::new())),
            ("acute_myocardial_infarction", ColType::StringWithDefault(String::new())),
            ("congestive_heart_failure", ColType::StringWithDefault(String::new())),
            ("sepsis", ColType::StringWithDefault(String::new())),
            ("serious_lung_disease", ColType::StringWithDefault(String::new())),
            ("abnormal_pulmonary_function", ColType::StringWithDefault(String::new())),
            ("medical_patient_bed_rest", ColType::StringWithDefault(String::new())),
            ("oral_contraceptive_or_hrt", ColType::StringWithDefault(String::new())),
            ("pregnancy_or_postpartum", ColType::StringWithDefault(String::new())),
            ("adverse_pregnancy_history", ColType::StringWithDefault(String::new())),
            ("arthroscopic_surgery", ColType::StringWithDefault(String::new())),
            ("major_open_surgery", ColType::StringWithDefault(String::new())),
            ("laparoscopic_surgery", ColType::StringWithDefault(String::new())),
            ("malignancy", ColType::StringWithDefault(String::new())),
            ("confined_to_bed", ColType::StringWithDefault(String::new())),
            ("immobilising_cast", ColType::StringWithDefault(String::new())),
            ("central_venous_access", ColType::StringWithDefault(String::new())),
            ("history_of_vte", ColType::StringWithDefault(String::new())),
            ("family_history_of_thrombosis", ColType::StringWithDefault(String::new())),
            ("factor_v_leiden", ColType::StringWithDefault(String::new())),
            ("prothrombin_20210a", ColType::StringWithDefault(String::new())),
            ("lupus_anticoagulant", ColType::StringWithDefault(String::new())),
            ("anticardiolipin_antibodies", ColType::StringWithDefault(String::new())),
            ("elevated_homocysteine", ColType::StringWithDefault(String::new())),
            ("heparin_induced_thrombocytopenia", ColType::StringWithDefault(String::new())),
            ("other_thrombophilia", ColType::StringWithDefault(String::new())),
            ("stroke", ColType::StringWithDefault(String::new())),
            ("elective_arthroplasty", ColType::StringWithDefault(String::new())),
            ("hip_pelvis_leg_fracture", ColType::StringWithDefault(String::new())),
            ("acute_spinal_cord_injury", ColType::StringWithDefault(String::new())),
            ("multiple_trauma", ColType::StringWithDefault(String::new())),
            ("high_bleeding_risk", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "caprini_venous_thromboembolism_risk_assessments").await
    }
}
