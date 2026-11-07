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
    pub overall_highest_ukmec_category: i32,
    pub ukmec_cocp: Option<i32>,
    pub ukmec_pop: Option<i32>,
    pub ukmec_patch: Option<i32>,
    pub ukmec_ring: Option<i32>,
    pub ukmec_injection: Option<i32>,
    pub ukmec_implant: Option<i32>,
    pub ukmec_cu_iud: Option<i32>,
    pub ukmec_lng_ius: Option<i32>,
    pub ukmec_condom_male: Option<i32>,
    pub ukmec_condom_female: Option<i32>,
    pub ukmec_diaphragm: Option<i32>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grades (assessment_id, overall_highest_ukmec_category, \
            ukmec_cocp, ukmec_pop, ukmec_patch, ukmec_ring, ukmec_injection, \
            ukmec_implant, ukmec_cu_iud, ukmec_lng_ius, ukmec_condom_male, \
            ukmec_condom_female, ukmec_diaphragm, graded_at) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(self.overall_highest_ukmec_category)
        .bind(self.ukmec_cocp)
        .bind(self.ukmec_pop)
        .bind(self.ukmec_patch)
        .bind(self.ukmec_ring)
        .bind(self.ukmec_injection)
        .bind(self.ukmec_implant)
        .bind(self.ukmec_cu_iud)
        .bind(self.ukmec_lng_ius)
        .bind(self.ukmec_condom_male)
        .bind(self.ukmec_condom_female)
        .bind(self.ukmec_diaphragm)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grades SET assessment_id = $2, overall_highest_ukmec_category = $3, \
            ukmec_cocp = $4, ukmec_pop = $5, ukmec_patch = $6, ukmec_ring = $7, \
            ukmec_injection = $8, ukmec_implant = $9, ukmec_cu_iud = $10, ukmec_lng_ius \
            = $11, ukmec_condom_male = $12, ukmec_condom_female = $13, ukmec_diaphragm = \
            $14, graded_at = $15, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(self.overall_highest_ukmec_category)
        .bind(self.ukmec_cocp)
        .bind(self.ukmec_pop)
        .bind(self.ukmec_patch)
        .bind(self.ukmec_ring)
        .bind(self.ukmec_injection)
        .bind(self.ukmec_implant)
        .bind(self.ukmec_cu_iud)
        .bind(self.ukmec_lng_ius)
        .bind(self.ukmec_condom_male)
        .bind(self.ukmec_condom_female)
        .bind(self.ukmec_diaphragm)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
