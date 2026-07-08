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
            ("exclude_hiv", ColType::String),
            ("exclude_substance_abuse", ColType::String),
            ("exclude_mental_health", ColType::String),
            ("exclude_genetic_info", ColType::String),
            ("exclude_sti", ColType::String),
            ("additional_restrictions", ColType::Text),
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
