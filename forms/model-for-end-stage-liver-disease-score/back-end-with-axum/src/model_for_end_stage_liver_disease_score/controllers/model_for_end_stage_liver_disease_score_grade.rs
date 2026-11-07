#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::model_for_end_stage_liver_disease_score_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub model_for_end_stage_liver_disease_score_id: Uuid,
    pub bilirubin_mg_dl: Option<f64>,
    pub creatinine_mg_dl: Option<f64>,
    pub creatinine_adjusted: Option<f64>,
    pub dialysis_rule_applied: bool,
    pub meld_score: Option<i32>,
    pub mortality_band: String,
    pub estimated_mortality_percent: Option<f64>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO model_for_end_stage_liver_disease_score_grades \
            (model_for_end_stage_liver_disease_score_id, bilirubin_mg_dl, \
            creatinine_mg_dl, creatinine_adjusted, dialysis_rule_applied, meld_score, \
            mortality_band, estimated_mortality_percent, graded_at) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(self.model_for_end_stage_liver_disease_score_id)
        .bind(self.bilirubin_mg_dl)
        .bind(self.creatinine_mg_dl)
        .bind(self.creatinine_adjusted)
        .bind(self.dialysis_rule_applied)
        .bind(self.meld_score)
        .bind(&self.mortality_band)
        .bind(self.estimated_mortality_percent)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE model_for_end_stage_liver_disease_score_grades SET \
            model_for_end_stage_liver_disease_score_id = $2, bilirubin_mg_dl = $3, \
            creatinine_mg_dl = $4, creatinine_adjusted = $5, dialysis_rule_applied = $6, \
            meld_score = $7, mortality_band = $8, estimated_mortality_percent = $9, \
            graded_at = $10, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.model_for_end_stage_liver_disease_score_id)
        .bind(self.bilirubin_mg_dl)
        .bind(self.creatinine_mg_dl)
        .bind(self.creatinine_adjusted)
        .bind(self.dialysis_rule_applied)
        .bind(self.meld_score)
        .bind(&self.mortality_band)
        .bind(self.estimated_mortality_percent)
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
        .prefix("api/model_for_end_stage_liver_disease_score_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
