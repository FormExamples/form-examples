use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Patient::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Patient::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Patient::CreatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Patient::UpdatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Patient::DeletedAt).timestamp_with_time_zone().null())
                    .col(ColumnDef::new(Patient::Surname).string_len(255).not_null().default(""))
                    .col(ColumnDef::new(Patient::GivenNames).string_len(255).not_null().default(""))
                    .col(ColumnDef::new(Patient::BirthDate).date().null())
                    .col(ColumnDef::new(Patient::Sex).string_len(15).not_null().default(""))
                    .col(ColumnDef::new(Patient::NationalityAsIso31661Alpha3).char_len(3).not_null().default(""))
                    .col(ColumnDef::new(Patient::TravelDocumentKind).string_len(30).not_null().default(""))
                    .col(ColumnDef::new(Patient::TravelDocumentNumber).string_len(50).not_null().default(""))
                    .col(ColumnDef::new(Patient::ConsentedToDataSharing).string_len(5).not_null().default(""))
                    .col(ColumnDef::new(Patient::SignatureImageDataUrl).text().not_null().default(""))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Patient::Table).to_owned()).await
    }
}

#[derive(DeriveIden)]
enum Patient {
    Table,
    Id,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    Surname,
    GivenNames,
    BirthDate,
    Sex,
    NationalityAsIso31661Alpha3,
    TravelDocumentKind,
    TravelDocumentNumber,
    ConsentedToDataSharing,
    SignatureImageDataUrl,
}
