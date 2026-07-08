use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "casualty_card_primary_surveys",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("airway_status", ColType::Text),
            ("airway_adjuncts", ColType::Text),
            ("c_spine_immobilised", ColType::Text),
            ("breathing_effort", ColType::Text),
            ("chest_movement", ColType::Text),
            ("breath_sounds", ColType::Text),
            ("trachea_position", ColType::Text),
            ("pulse_character", ColType::Text),
            ("skin_colour", ColType::Text),
            ("skin_temperature", ColType::Text),
            ("capillary_refill", ColType::Text),
            ("haemorrhage", ColType::Text),
            ("iv_access", ColType::Text),
            ("gcs_eye", ColType::IntegerNull),
            ("gcs_verbal", ColType::IntegerNull),
            ("gcs_motor", ColType::IntegerNull),
            ("gcs_total", ColType::IntegerNull),
            ("pupils", ColType::Text),
            ("blood_glucose_disability", ColType::Text),
            ("limb_movements", ColType::Text),
            ("skin_examination", ColType::Text),
            ("injuries_identified", ColType::Text),
            ("log_roll_findings", ColType::Text),
            ],
            &[
            ("casualty_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_primary_surveys").await
    }
}
