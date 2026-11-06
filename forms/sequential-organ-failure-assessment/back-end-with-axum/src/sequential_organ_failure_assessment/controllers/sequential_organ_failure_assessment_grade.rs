#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::sequential_organ_failure_assessment_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub sequential_organ_failure_assessment_id: Uuid,
    pub respiration_score: Option<i32>,
    pub coagulation_score: Option<i32>,
    pub liver_score: Option<i32>,
    pub cardiovascular_score: Option<i32>,
    pub cns_score: Option<i32>,
    pub renal_score: Option<i32>,
    pub total_score: Option<i32>,
    pub delta_sofa: Option<i32>,
    pub mortality_band: String,
    pub sepsis3: bool,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO sequential_organ_failure_assessment_grades \
            (sequential_organ_failure_assessment_id, respiration_score, coagulation_score, \
            liver_score, cardiovascular_score, cns_score, renal_score, total_score, \
            delta_sofa, mortality_band, sepsis3, graded_at) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12) RETURNING *",
        )
        .bind(self.sequential_organ_failure_assessment_id)
        .bind(self.respiration_score)
        .bind(self.coagulation_score)
        .bind(self.liver_score)
        .bind(self.cardiovascular_score)
        .bind(self.cns_score)
        .bind(self.renal_score)
        .bind(self.total_score)
        .bind(self.delta_sofa)
        .bind(&self.mortality_band)
        .bind(self.sepsis3)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE sequential_organ_failure_assessment_grades SET \
            sequential_organ_failure_assessment_id = $2, respiration_score = $3, \
            coagulation_score = $4, liver_score = $5, cardiovascular_score = $6, cns_score = \
            $7, renal_score = $8, total_score = $9, delta_sofa = $10, mortality_band = $11, \
            sepsis3 = $12, graded_at = $13, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.sequential_organ_failure_assessment_id)
        .bind(self.respiration_score)
        .bind(self.coagulation_score)
        .bind(self.liver_score)
        .bind(self.cardiovascular_score)
        .bind(self.cns_score)
        .bind(self.renal_score)
        .bind(self.total_score)
        .bind(self.delta_sofa)
        .bind(&self.mortality_band)
        .bind(self.sepsis3)
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
        .prefix("api/sequential_organ_failure_assessment_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
