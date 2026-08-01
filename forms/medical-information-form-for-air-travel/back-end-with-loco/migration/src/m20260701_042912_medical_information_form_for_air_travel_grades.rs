use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_information_form_for_air_travel_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("computed_fitness_band", ColType::StringWithDefault(String::new())),
            ("final_fitness_band", ColType::StringWithDefault(String::new())),
            ("override_reason", ColType::StringWithDefault(String::new())),
            ("desk_recommendation", ColType::StringWithDefault(String::new())),
            ("physician_notes", ColType::TextWithDefault(String::new())),
            ("valid_until", ColType::DateNull),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("medical_information_form_for_air_travel", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_information_form_for_air_travel_grades").await
    }
}
