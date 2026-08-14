use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "allergies",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("scientific_name", ColType::TextWithDefault(String::new())),
            ("european_union_name", ColType::TextWithDefault(String::new())),
            ("united_states_name", ColType::TextWithDefault(String::new())),
            ("cosmetic_name", ColType::TextWithDefault(String::new())),
            ("kind", ColType::TextWithDefault(String::new())),
            ("is_regulated_food_allergen", ColType::BooleanWithDefault(false)),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "allergies").await
    }
}
