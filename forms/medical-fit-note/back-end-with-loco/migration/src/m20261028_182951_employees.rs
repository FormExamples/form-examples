use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "employees", &[
            
            ("id", ColType::PkUuid),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("name", ColType::String),
            ("birth_date", ColType::Date),
            ("email", ColType::TextNull),
            ("phone", ColType::TextNull),
            ("postal_address_as_full_text", ColType::TextNull),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("postcode", ColType::TextNull),
            ("united_kingdom_nhs_number", ColType::StringNull),
            ("employer_name", ColType::TextWithDefault(String::new())),
            ("job_title", ColType::TextWithDefault(String::new())),
], &[]).await?;
m.get_connection().execute_unprepared("ALTER TABLE employees ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "employees").await
    }
}
