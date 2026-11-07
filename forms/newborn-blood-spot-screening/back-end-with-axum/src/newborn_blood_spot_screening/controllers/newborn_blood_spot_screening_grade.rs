#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::newborn_blood_spot_screening_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub newborn_blood_spot_screening_id: Uuid,
    pub overall_outcome: String,
    pub referral_status: String,
    pub sample_adequate: Option<bool>,
    pub within_window: Option<bool>,
    pub avoidable_repeat: Option<bool>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO newborn_blood_spot_screening_grades (newborn_blood_spot_screening_id, \
            overall_outcome, referral_status, sample_adequate, within_window, \
            avoidable_repeat, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(self.newborn_blood_spot_screening_id)
        .bind(&self.overall_outcome)
        .bind(&self.referral_status)
        .bind(self.sample_adequate)
        .bind(self.within_window)
        .bind(self.avoidable_repeat)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE newborn_blood_spot_screening_grades SET \
            newborn_blood_spot_screening_id = $2, overall_outcome = $3, referral_status \
            = $4, sample_adequate = $5, within_window = $6, avoidable_repeat = $7, \
            graded_at = $8, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.newborn_blood_spot_screening_id)
        .bind(&self.overall_outcome)
        .bind(&self.referral_status)
        .bind(self.sample_adequate)
        .bind(self.within_window)
        .bind(self.avoidable_repeat)
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
        .prefix("api/newborn_blood_spot_screening_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
