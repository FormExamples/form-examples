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
            
            ("status", ColType::String),
            ("patient_identifier", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("age_band", ColType::String),
            ("symptomatic_leg", ColType::String),
            ("active_cancer", ColType::String),
            ("paralysis_or_immobilisation", ColType::String),
            ("recently_bedridden_or_surgery", ColType::String),
            ("localised_tenderness", ColType::String),
            ("entire_leg_swollen", ColType::String),
            ("calf_swelling_over_3cm", ColType::String),
            ("pitting_oedema", ColType::String),
            ("collateral_superficial_veins", ColType::String),
            ("previously_documented_dvt", ColType::String),
            ("alternative_diagnosis_as_likely", ColType::String),
            ("clinical_notes", ColType::Text),
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
