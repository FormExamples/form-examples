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
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("admission_type", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("minor_surgery", ColType::String),
            ("recent_major_surgery", ColType::String),
            ("varicose_veins", ColType::String),
            ("inflammatory_bowel_disease", ColType::String),
            ("swollen_legs", ColType::String),
            ("obesity", ColType::String),
            ("acute_myocardial_infarction", ColType::String),
            ("congestive_heart_failure", ColType::String),
            ("sepsis", ColType::String),
            ("serious_lung_disease", ColType::String),
            ("abnormal_pulmonary_function", ColType::String),
            ("medical_patient_bed_rest", ColType::String),
            ("oral_contraceptive_or_hrt", ColType::String),
            ("pregnancy_or_postpartum", ColType::String),
            ("adverse_pregnancy_history", ColType::String),
            ("arthroscopic_surgery", ColType::String),
            ("major_open_surgery", ColType::String),
            ("laparoscopic_surgery", ColType::String),
            ("malignancy", ColType::String),
            ("confined_to_bed", ColType::String),
            ("immobilising_cast", ColType::String),
            ("central_venous_access", ColType::String),
            ("history_of_vte", ColType::String),
            ("family_history_of_thrombosis", ColType::String),
            ("factor_v_leiden", ColType::String),
            ("prothrombin_20210a", ColType::String),
            ("lupus_anticoagulant", ColType::String),
            ("anticardiolipin_antibodies", ColType::String),
            ("elevated_homocysteine", ColType::String),
            ("heparin_induced_thrombocytopenia", ColType::String),
            ("other_thrombophilia", ColType::String),
            ("stroke", ColType::String),
            ("elective_arthroplasty", ColType::String),
            ("hip_pelvis_leg_fracture", ColType::String),
            ("acute_spinal_cord_injury", ColType::String),
            ("multiple_trauma", ColType::String),
            ("high_bleeding_risk", ColType::String),
            ("clinical_note", ColType::Text),
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
