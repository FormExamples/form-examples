use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "assessment_current_medications",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "takes_regular_medications",
                    ColType::StringWithDefault(String::new()),
                ),
                ("current_hrt", ColType::StringWithDefault(String::new())),
                (
                    "current_hrt_type",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "current_hrt_route",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "current_hrt_duration",
                    ColType::StringWithDefault(String::new()),
                ),
                ("previous_hrt", ColType::StringWithDefault(String::new())),
                (
                    "previous_hrt_details",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "reason_for_stopping_hrt",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "takes_herbal_supplements",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "herbal_supplement_details",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "takes_anticoagulants",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "anticoagulant_details",
                    ColType::TextWithDefault(String::new()),
                ),
                ("medication_notes", ColType::TextWithDefault(String::new())),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE assessment_current_medications ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_current_medications").await
    }
}
