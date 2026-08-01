use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "casualty_card_vital_signs",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("heart_rate", ColType::IntegerNull),
            ("systolic_bp", ColType::IntegerNull),
            ("diastolic_bp", ColType::IntegerNull),
            ("respiratory_rate", ColType::IntegerNull),
            ("oxygen_saturation", ColType::IntegerNull),
            ("supplemental_oxygen", ColType::TextWithDefault(String::new())),
            ("oxygen_flow_rate", ColType::TextWithDefault(String::new())),
            ("temperature", ColType::DoubleNull),
            ("blood_glucose", ColType::DoubleNull),
            ("consciousness_level", ColType::TextWithDefault(String::new())),
            ("pupil_left_size", ColType::IntegerNull),
            ("pupil_left_reactive", ColType::TextWithDefault(String::new())),
            ("pupil_right_size", ColType::IntegerNull),
            ("pupil_right_reactive", ColType::TextWithDefault(String::new())),
            ("capillary_refill_time", ColType::TextWithDefault(String::new())),
            ("weight", ColType::DoubleNull),
            ],
            &[
            ("casualty_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_vital_signs").await
    }
}
