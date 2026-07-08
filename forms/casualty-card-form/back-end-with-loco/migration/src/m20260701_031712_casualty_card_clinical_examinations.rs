use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "casualty_card_clinical_examinations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("general_appearance", ColType::Text),
            ("head_and_face", ColType::Text),
            ("neck", ColType::Text),
            ("chest_cardiovascular", ColType::Text),
            ("chest_respiratory", ColType::Text),
            ("abdomen", ColType::Text),
            ("pelvis", ColType::Text),
            ("musculoskeletal_limbs", ColType::Text),
            ("neurological", ColType::Text),
            ("skin", ColType::Text),
            ("mental_state", ColType::Text),
            ("body_diagram_notes", ColType::Text),
            ],
            &[
            ("casualty_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_clinical_examinations").await
    }
}
