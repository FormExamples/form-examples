#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub assessment_id: Uuid,
    pub physical_fitness_level: String,
    pub clinical_skills_level: String,
    pub equipment_vehicle_level: String,
    pub communication_level: String,
    pub psychological_level: String,
    pub overall_competency: String,
    pub overall_fitness: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grades (assessment_id, physical_fitness_level, \
            clinical_skills_level, equipment_vehicle_level, communication_level, \
            psychological_level, overall_competency, overall_fitness, graded_at) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(&self.physical_fitness_level)
        .bind(&self.clinical_skills_level)
        .bind(&self.equipment_vehicle_level)
        .bind(&self.communication_level)
        .bind(&self.psychological_level)
        .bind(&self.overall_competency)
        .bind(&self.overall_fitness)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grades SET assessment_id = $2, physical_fitness_level = $3, \
            clinical_skills_level = $4, equipment_vehicle_level = $5, \
            communication_level = $6, psychological_level = $7, overall_competency = $8, \
            overall_fitness = $9, graded_at = $10, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(&self.physical_fitness_level)
        .bind(&self.clinical_skills_level)
        .bind(&self.equipment_vehicle_level)
        .bind(&self.communication_level)
        .bind(&self.psychological_level)
        .bind(&self.overall_competency)
        .bind(&self.overall_fitness)
        .bind(self.graded_at)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
