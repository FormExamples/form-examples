use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "wells_score_for_deep_vein_thromboses",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("symptomatic_leg", ColType::StringWithDefault(String::new())),
            ("active_cancer", ColType::StringWithDefault(String::new())),
            ("paralysis_or_immobilisation", ColType::StringWithDefault(String::new())),
            ("recently_bedridden_or_surgery", ColType::StringWithDefault(String::new())),
            ("localised_tenderness", ColType::StringWithDefault(String::new())),
            ("entire_leg_swollen", ColType::StringWithDefault(String::new())),
            ("calf_swelling_over_3cm", ColType::StringWithDefault(String::new())),
            ("pitting_oedema", ColType::StringWithDefault(String::new())),
            ("collateral_superficial_veins", ColType::StringWithDefault(String::new())),
            ("previously_documented_dvt", ColType::StringWithDefault(String::new())),
            ("alternative_diagnosis_as_likely", ColType::StringWithDefault(String::new())),
            ("clinical_notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "wells_score_for_deep_vein_thromboses").await
    }
}
