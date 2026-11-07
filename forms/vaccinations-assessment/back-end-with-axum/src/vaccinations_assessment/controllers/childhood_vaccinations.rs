#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::childhood_vaccinations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub assessment_id: Uuid,
    pub dtap_ipv_hib_hepb: Option<i32>,
    pub pneumococcal: Option<i32>,
    pub rotavirus: Option<i32>,
    pub meningitis_b: Option<i32>,
    pub mmr: Option<i32>,
    pub hib_menc: Option<i32>,
    pub preschool_booster: Option<i32>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO childhood_vaccinations (assessment_id, dtap_ipv_hib_hepb, \
            pneumococcal, rotavirus, meningitis_b, mmr, hib_menc, preschool_booster) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(self.dtap_ipv_hib_hepb)
        .bind(self.pneumococcal)
        .bind(self.rotavirus)
        .bind(self.meningitis_b)
        .bind(self.mmr)
        .bind(self.hib_menc)
        .bind(self.preschool_booster)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE childhood_vaccinations SET assessment_id = $2, dtap_ipv_hib_hepb = \
            $3, pneumococcal = $4, rotavirus = $5, meningitis_b = $6, mmr = $7, hib_menc \
            = $8, preschool_booster = $9, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(self.dtap_ipv_hib_hepb)
        .bind(self.pneumococcal)
        .bind(self.rotavirus)
        .bind(self.meningitis_b)
        .bind(self.mmr)
        .bind(self.hib_menc)
        .bind(self.preschool_booster)
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
        .prefix("api/childhood_vaccinations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
