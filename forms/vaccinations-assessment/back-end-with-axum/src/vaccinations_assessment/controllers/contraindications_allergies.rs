#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::contraindications_allergies::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub assessment_id: Uuid,
    pub egg_allergy: String,
    pub gelatin_allergy: String,
    pub latex_allergy: String,
    pub neomycin_allergy: String,
    pub pregnant: String,
    pub pregnancy_weeks: String,
    pub severe_illness: String,
    pub previous_anaphylaxis: String,
    pub anaphylaxis_details: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO contraindications_allergies (assessment_id, egg_allergy, \
            gelatin_allergy, latex_allergy, neomycin_allergy, pregnant, pregnancy_weeks, \
            severe_illness, previous_anaphylaxis, anaphylaxis_details) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(&self.egg_allergy)
        .bind(&self.gelatin_allergy)
        .bind(&self.latex_allergy)
        .bind(&self.neomycin_allergy)
        .bind(&self.pregnant)
        .bind(&self.pregnancy_weeks)
        .bind(&self.severe_illness)
        .bind(&self.previous_anaphylaxis)
        .bind(&self.anaphylaxis_details)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE contraindications_allergies SET assessment_id = $2, egg_allergy = $3, \
            gelatin_allergy = $4, latex_allergy = $5, neomycin_allergy = $6, pregnant = \
            $7, pregnancy_weeks = $8, severe_illness = $9, previous_anaphylaxis = $10, \
            anaphylaxis_details = $11, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(&self.egg_allergy)
        .bind(&self.gelatin_allergy)
        .bind(&self.latex_allergy)
        .bind(&self.neomycin_allergy)
        .bind(&self.pregnant)
        .bind(&self.pregnancy_weeks)
        .bind(&self.severe_illness)
        .bind(&self.previous_anaphylaxis)
        .bind(&self.anaphylaxis_details)
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
        .prefix("api/contraindications_allergies/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
