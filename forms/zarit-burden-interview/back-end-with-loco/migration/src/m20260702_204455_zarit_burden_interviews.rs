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
            
            ("practitioner_name", ColType::StringWithDefault(String::new())),
            ("practitioner_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("instrument_form", ColType::StringWithDefault("zbi22".to_string())),
            ("carer_identifier", ColType::StringWithDefault(String::new())),
            ("carer_relationship", ColType::StringWithDefault(String::new())),
            ("carer_co_resident", ColType::StringWithDefault(String::new())),
            ("care_hours_per_week", ColType::DoubleNull),
            ("recipient_identifier", ColType::StringWithDefault(String::new())),
            ("recipient_condition", ColType::StringWithDefault(String::new())),
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
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
