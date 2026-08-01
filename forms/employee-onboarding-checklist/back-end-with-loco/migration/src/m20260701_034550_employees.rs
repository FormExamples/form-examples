use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "employees",
            &[

            ("id", ColType::PkAuto),

            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("first_name", ColType::String),
            ("last_name", ColType::String),
            ("date_of_birth", ColType::Date),
            ("nhs_number", ColType::StringNull),
            ("email", ColType::StringWithDefault(String::new())),
            ("phone", ColType::StringWithDefault(String::new())),
            ("job_title", ColType::StringWithDefault(String::new())),
            ("department", ColType::StringWithDefault(String::new())),
            ("start_date", ColType::DateNull),
            ],
            &[
            ]
        ).await?;

        m.create_index(
            Index::create()
                .if_not_exists()
                .unique()
                .name("index_employees_nhs_number_unique")
                .table(Alias::new("employees"))
                .col(Alias::new("nhs_number"))
                .to_owned(),
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "employees").await
    }
}
