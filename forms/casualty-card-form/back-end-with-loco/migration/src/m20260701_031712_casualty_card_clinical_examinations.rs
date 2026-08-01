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
            ("general_appearance", ColType::TextWithDefault(String::new())),
            ("head_and_face", ColType::TextWithDefault(String::new())),
            ("neck", ColType::TextWithDefault(String::new())),
            ("chest_cardiovascular", ColType::TextWithDefault(String::new())),
            ("chest_respiratory", ColType::TextWithDefault(String::new())),
            ("abdomen", ColType::TextWithDefault(String::new())),
            ("pelvis", ColType::TextWithDefault(String::new())),
            ("musculoskeletal_limbs", ColType::TextWithDefault(String::new())),
            ("neurological", ColType::TextWithDefault(String::new())),
            ("skin", ColType::TextWithDefault(String::new())),
            ("mental_state", ColType::TextWithDefault(String::new())),
            ("body_diagram_notes", ColType::TextWithDefault(String::new())),
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
