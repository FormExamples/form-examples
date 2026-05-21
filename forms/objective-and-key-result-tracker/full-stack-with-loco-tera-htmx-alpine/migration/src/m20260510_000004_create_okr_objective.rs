use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        let stmt = sea_orm_migration::sea_orm::Statement::from_string(
            sea_orm_migration::sea_orm::DatabaseBackend::Postgres,
            r#"
            CREATE TABLE IF NOT EXISTS okr_objective (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                reporter_id uuid NOT NULL REFERENCES reporter(id),
                obj_title text NOT NULL DEFAULT '',
                obj_long_description text NOT NULL DEFAULT '',
                strategic_theme text NOT NULL DEFAULT '',
                parent_objective_id uuid REFERENCES okr_objective(id),
                level text NOT NULL DEFAULT '',
                cycle text NOT NULL DEFAULT '',
                cycle_start_date date,
                cycle_end_date date,
                status text NOT NULL DEFAULT 'draft',
                progress_percent int,
                confidence_decile int,
                stretch_tier int,
                alignment_grade int,
                impact_tier int,
                smart_quality int,
                pace_deviation_percent int,
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
            "DROP TABLE IF EXISTS okr_objective;".to_string(),
        );
        m.get_connection().execute(stmt).await?;
        Ok(())
    }
}
