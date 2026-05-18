use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Icvp::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Icvp::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Icvp::CreatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Icvp::UpdatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Icvp::DeletedAt).timestamp_with_time_zone().null())
                    .col(ColumnDef::new(Icvp::PatientId).uuid().not_null())
                    .col(ColumnDef::new(Icvp::ClinicianId).uuid().not_null())
                    .col(ColumnDef::new(Icvp::CenterId).uuid().not_null())
                    .col(ColumnDef::new(Icvp::Status).string_len(20).not_null().default("draft"))
                    .col(ColumnDef::new(Icvp::CertificateSerialNumber).string_len(50).not_null().default(""))
                    .col(ColumnDef::new(Icvp::IssuingCountryAsIso31661Alpha3).char_len(3).not_null().default(""))
                    .col(ColumnDef::new(Icvp::PrimaryLanguageAsBcp47).string_len(10).not_null().default("en"))
                    .col(ColumnDef::new(Icvp::SecondaryLanguageAsBcp47).string_len(10).not_null().default("fr"))
                    .col(ColumnDef::new(Icvp::OverallValid).string_len(5).not_null().default(""))
                    .col(ColumnDef::new(Icvp::Notes).text().not_null().default(""))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Icvp::Table).to_owned()).await
    }
}

#[derive(DeriveIden)]
enum Icvp {
    #[sea_orm(iden = "international_certificate_of_vaccination_or_prophylaxis")]
    Table,
    Id,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    PatientId,
    ClinicianId,
    CenterId,
    Status,
    CertificateSerialNumber,
    IssuingCountryAsIso31661Alpha3,
    PrimaryLanguageAsBcp47,
    SecondaryLanguageAsBcp47,
    OverallValid,
    Notes,
}
