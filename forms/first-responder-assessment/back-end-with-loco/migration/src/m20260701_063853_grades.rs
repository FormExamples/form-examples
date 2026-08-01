use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("physical_fitness_level", ColType::StringWithDefault(String::new())),
            ("clinical_skills_level", ColType::StringWithDefault(String::new())),
            ("equipment_vehicle_level", ColType::StringWithDefault(String::new())),
            ("communication_level", ColType::StringWithDefault(String::new())),
            ("psychological_level", ColType::StringWithDefault(String::new())),
            ("overall_competency", ColType::StringWithDefault(String::new())),
            ("overall_fitness", ColType::StringWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "grades").await
    }
}
