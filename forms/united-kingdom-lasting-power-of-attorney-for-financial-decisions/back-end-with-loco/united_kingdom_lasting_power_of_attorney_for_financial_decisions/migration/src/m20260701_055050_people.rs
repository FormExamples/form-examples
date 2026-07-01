use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "people",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("title", ColType::Text),
            ("first_names", ColType::Text),
            ("last_name", ColType::Text),
            ("other_names", ColType::Text),
            ("date_of_birth", ColType::DateNull),
            ("email", ColType::Text),
            ("phone", ColType::Text),
            ("address_id", ColType::UuidNull),
            ("is_trust_corporation", ColType::Boolean),
            ("trust_corporation_number", ColType::Text),
            ("is_bankrupt", ColType::Boolean),
            ("has_debt_relief_order", ColType::Boolean),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "people").await
    }
}
