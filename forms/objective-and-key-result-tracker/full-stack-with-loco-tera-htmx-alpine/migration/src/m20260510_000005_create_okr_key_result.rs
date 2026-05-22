use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        let stmt = sea_orm_migration::sea_orm::Statement::from_string(
            sea_orm_migration::sea_orm::DatabaseBackend::Postgres,
            r#"
            CREATE TABLE IF NOT EXISTS okr_key_result (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                objective_id uuid NOT NULL REFERENCES okr_objective(id) ON DELETE CASCADE,
                position int NOT NULL,
                title text NOT NULL DEFAULT '',
                kr_type text NOT NULL DEFAULT '',
                start_value double precision,
                current_value double precision,
                target_value double precision,
                progress_fraction double precision,
                milestones_json jsonb,
                binary_done boolean,
                created_at timestamptz NOT NULL DEFAULT now(),
                updated_at timestamptz NOT NULL DEFAULT now(),
                deleted_at timestamptz
            );
            "#.to_string(),
        );
        m.get_connection().execute(stmt).await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        let stmt = sea_orm_migration::sea_orm::Statement::from_string(
            sea_orm_migration::sea_orm::DatabaseBackend::Postgres,
            "DROP TABLE IF EXISTS okr_key_result;".to_string(),
        );
        m.get_connection().execute(stmt).await?;
        Ok(())
    }
}
