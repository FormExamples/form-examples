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
            ("airway_status", ColType::TextWithDefault(String::new())),
            ("airway_adjuncts", ColType::TextWithDefault(String::new())),
            ("c_spine_immobilised", ColType::TextWithDefault(String::new())),
            ("breathing_effort", ColType::TextWithDefault(String::new())),
            ("chest_movement", ColType::TextWithDefault(String::new())),
            ("breath_sounds", ColType::TextWithDefault(String::new())),
            ("trachea_position", ColType::TextWithDefault(String::new())),
            ("pulse_character", ColType::TextWithDefault(String::new())),
            ("skin_colour", ColType::TextWithDefault(String::new())),
            ("skin_temperature", ColType::TextWithDefault(String::new())),
            ("capillary_refill", ColType::TextWithDefault(String::new())),
            ("haemorrhage", ColType::TextWithDefault(String::new())),
            ("iv_access", ColType::TextWithDefault(String::new())),
            ("gcs_eye", ColType::IntegerNull),
            ("gcs_verbal", ColType::IntegerNull),
            ("gcs_motor", ColType::IntegerNull),
            ("gcs_total", ColType::IntegerNull),
            ("pupils", ColType::TextWithDefault(String::new())),
            ("blood_glucose_disability", ColType::TextWithDefault(String::new())),
            ("limb_movements", ColType::TextWithDefault(String::new())),
            ("skin_examination", ColType::TextWithDefault(String::new())),
            ("injuries_identified", ColType::TextWithDefault(String::new())),
            ("log_roll_findings", ColType::TextWithDefault(String::new())),
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
