use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "assessment_rom_measurements",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("movement", ColType::StringWithDefault(String::new())),
                ("active_degrees", ColType::IntegerNull),
                ("passive_degrees", ColType::IntegerNull),
                ("normal_degrees", ColType::IntegerNull),
                ("end_feel", ColType::StringWithDefault(String::new())),
                (
                    "pain_on_movement",
                    ColType::StringWithDefault(String::new()),
                ),
                ("sort_order", ColType::IntegerWithDefault(0)),
                ("assessment_range_of_motion_id", ColType::Uuid),
            ],
            &[(
                "assessment_range_of_motion",
                "assessment_range_of_motion_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE assessment_rom_measurements ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_rom_measurements").await
    }
}
