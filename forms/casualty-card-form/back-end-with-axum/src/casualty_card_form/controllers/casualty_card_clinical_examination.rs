#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::casualty_card_clinical_examinations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub casualty_card_id: Uuid,
    pub general_appearance: String,
    pub head_and_face: String,
    pub neck: String,
    pub chest_cardiovascular: String,
    pub chest_respiratory: String,
    pub abdomen: String,
    pub pelvis: String,
    pub musculoskeletal_limbs: String,
    pub neurological: String,
    pub skin: String,
    pub mental_state: String,
    pub body_diagram_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO casualty_card_clinical_examinations (casualty_card_id, \
            general_appearance, head_and_face, neck, chest_cardiovascular, \
            chest_respiratory, abdomen, pelvis, musculoskeletal_limbs, neurological, \
            skin, mental_state, body_diagram_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.casualty_card_id)
        .bind(&self.general_appearance)
        .bind(&self.head_and_face)
        .bind(&self.neck)
        .bind(&self.chest_cardiovascular)
        .bind(&self.chest_respiratory)
        .bind(&self.abdomen)
        .bind(&self.pelvis)
        .bind(&self.musculoskeletal_limbs)
        .bind(&self.neurological)
        .bind(&self.skin)
        .bind(&self.mental_state)
        .bind(&self.body_diagram_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE casualty_card_clinical_examinations SET casualty_card_id = $2, \
            general_appearance = $3, head_and_face = $4, neck = $5, chest_cardiovascular \
            = $6, chest_respiratory = $7, abdomen = $8, pelvis = $9, \
            musculoskeletal_limbs = $10, neurological = $11, skin = $12, mental_state = \
            $13, body_diagram_notes = $14, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.casualty_card_id)
        .bind(&self.general_appearance)
        .bind(&self.head_and_face)
        .bind(&self.neck)
        .bind(&self.chest_cardiovascular)
        .bind(&self.chest_respiratory)
        .bind(&self.abdomen)
        .bind(&self.pelvis)
        .bind(&self.musculoskeletal_limbs)
        .bind(&self.neurological)
        .bind(&self.skin)
        .bind(&self.mental_state)
        .bind(&self.body_diagram_notes)
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
        .prefix("api/casualty_card_clinical_examinations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
