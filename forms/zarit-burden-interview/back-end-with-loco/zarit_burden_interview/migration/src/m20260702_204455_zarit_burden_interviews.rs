use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "zarit_burden_interviews",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("practitioner_name", ColType::String),
            ("practitioner_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("instrument_form", ColType::String),
            ("carer_identifier", ColType::String),
            ("carer_relationship", ColType::String),
            ("carer_co_resident", ColType::String),
            ("care_hours_per_week", ColType::DoubleNull),
            ("recipient_identifier", ColType::String),
            ("recipient_condition", ColType::String),
            ("item_1", ColType::IntegerNull),
            ("item_2", ColType::IntegerNull),
            ("item_3", ColType::IntegerNull),
            ("item_4", ColType::IntegerNull),
            ("item_5", ColType::IntegerNull),
            ("item_6", ColType::IntegerNull),
            ("item_7", ColType::IntegerNull),
            ("item_8", ColType::IntegerNull),
            ("item_9", ColType::IntegerNull),
            ("item_10", ColType::IntegerNull),
            ("item_11", ColType::IntegerNull),
            ("item_12", ColType::IntegerNull),
            ("item_13", ColType::IntegerNull),
            ("item_14", ColType::IntegerNull),
            ("item_15", ColType::IntegerNull),
            ("item_16", ColType::IntegerNull),
            ("item_17", ColType::IntegerNull),
            ("item_18", ColType::IntegerNull),
            ("item_19", ColType::IntegerNull),
            ("item_20", ColType::IntegerNull),
            ("item_21", ColType::IntegerNull),
            ("item_22", ColType::IntegerNull),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "zarit_burden_interviews").await
    }
}
