use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "recognition_of_stroke_in_the_emergency_room_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rosier_score", ColType::IntegerNull),
                ("stroke_likely", ColType::StringWithDefault(String::new())),
                (
                    "glucose_excluded",
                    ColType::StringWithDefault(String::new()),
                ),
                ("graded_at", ColType::TimestampWithTimeZone),
                (
                    "recognition_of_stroke_in_the_emergency_room_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "recognition_of_stroke_in_the_emergency_room",
                "recognition_of_stroke_in_the_emergency_room_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE recognition_of_stroke_in_the_emergency_room_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "recognition_of_stroke_in_the_emergency_room_grades").await
    }
}
