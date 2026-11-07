#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::qrisk3_cardiovascular_disease_risk_score_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub ten_year_risk_percent: Option<f64>,
    pub risk_band: String,
    pub heart_age: Option<f64>,
    pub linear_predictor: Option<f64>,
    pub graded_at: DateTimeWithTimeZone,
    pub qrisk3_cardiovascular_disease_risk_score_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO qrisk3_cardiovascular_disease_risk_score_grades \
            (ten_year_risk_percent, risk_band, heart_age, linear_predictor, graded_at, \
            qrisk3_cardiovascular_disease_risk_score_id) VALUES ($1, $2, $3, $4, $5, $6) \
            RETURNING *",
        )
        .bind(self.ten_year_risk_percent)
        .bind(&self.risk_band)
        .bind(self.heart_age)
        .bind(self.linear_predictor)
        .bind(self.graded_at)
        .bind(self.qrisk3_cardiovascular_disease_risk_score_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE qrisk3_cardiovascular_disease_risk_score_grades SET \
            ten_year_risk_percent = $2, risk_band = $3, heart_age = $4, linear_predictor \
            = $5, graded_at = $6, qrisk3_cardiovascular_disease_risk_score_id = $7, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.ten_year_risk_percent)
        .bind(&self.risk_band)
        .bind(self.heart_age)
        .bind(self.linear_predictor)
        .bind(self.graded_at)
        .bind(self.qrisk3_cardiovascular_disease_risk_score_id)
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
        .prefix("api/qrisk3_cardiovascular_disease_risk_score_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
