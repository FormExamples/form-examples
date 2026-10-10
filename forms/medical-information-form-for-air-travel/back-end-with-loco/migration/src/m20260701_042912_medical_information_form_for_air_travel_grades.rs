use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "medical_information_form_for_air_travel_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "computed_fitness_band",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "final_fitness_band",
                    ColType::StringWithDefault(String::new()),
                ),
                ("override_reason", ColType::StringWithDefault(String::new())),
                (
                    "desk_recommendation",
                    ColType::StringWithDefault(String::new()),
                ),
                ("physician_notes", ColType::TextWithDefault(String::new())),
                ("valid_until", ColType::DateNull),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("medical_information_form_for_air_travel_id", ColType::Uuid),
            ],
            &[(
                "medical_information_form_for_air_travel",
                "medical_information_form_for_air_travel_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE medical_information_form_for_air_travel_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_information_form_for_air_travel_grades").await
    }
}
