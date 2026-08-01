use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "restrictions_limitations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("exclude_hiv", ColType::StringWithDefault(String::new())),
            ("exclude_substance_abuse", ColType::StringWithDefault(String::new())),
            ("exclude_mental_health", ColType::StringWithDefault(String::new())),
            ("exclude_genetic_info", ColType::StringWithDefault(String::new())),
            ("exclude_sti", ColType::StringWithDefault(String::new())),
            ("additional_restrictions", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("release_form", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "restrictions_limitations").await
    }
}
