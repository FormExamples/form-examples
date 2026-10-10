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
                    "taking_psychotropic_medication",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "medication_adherence",
                    ColType::StringWithDefault(String::new()),
                ),
                ("side_effects", ColType::StringWithDefault(String::new())),
                (
                    "side_effects_details",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "over_the_counter_medications",
                    ColType::TextWithDefault(String::new()),
                ),
                ("supplements", ColType::TextWithDefault(String::new())),
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
