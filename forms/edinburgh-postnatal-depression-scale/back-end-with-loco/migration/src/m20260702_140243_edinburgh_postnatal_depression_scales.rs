use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "edinburgh_postnatal_depression_scales",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("clinician_name", ColType::StringWithDefault(String::new())),
                ("clinician_role", ColType::StringWithDefault(String::new())),
                ("care_setting", ColType::StringWithDefault(String::new())),
                ("assessed_at", ColType::TimestampWithTimeZoneNull),
                ("perinatal_stage", ColType::StringWithDefault(String::new())),
                ("perinatal_week", ColType::DoubleNull),
                (
                    "respondent_identifier",
                    ColType::StringWithDefault(String::new()),
                ),
                ("age_band", ColType::StringWithDefault(String::new())),
                (
                    "preferred_language",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "assistance_needed",
                    ColType::StringWithDefault(String::new()),
                ),
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
                ("clinical_note", ColType::TextWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::UuidNull),
            ],
            &[("patient", "patient_id"), ("clinician?", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE edinburgh_postnatal_depression_scales ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "edinburgh_postnatal_depression_scales").await
    }
}
