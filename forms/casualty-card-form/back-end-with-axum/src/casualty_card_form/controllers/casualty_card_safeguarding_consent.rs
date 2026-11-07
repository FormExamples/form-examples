#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::casualty_card_safeguarding_consents::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub casualty_card_id: Uuid,
    pub safeguarding_concern: String,
    pub safeguarding_type: String,
    pub referral_made: String,
    pub mental_capacity_assessment: String,
    pub mental_health_act_status: String,
    pub consent_for_treatment: String,
    pub completed_by_name: String,
    pub completed_by_role: String,
    pub completed_by_gmc_number: String,
    pub senior_reviewing_clinician: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO casualty_card_safeguarding_consents (casualty_card_id, \
            safeguarding_concern, safeguarding_type, referral_made, \
            mental_capacity_assessment, mental_health_act_status, consent_for_treatment, \
            completed_by_name, completed_by_role, completed_by_gmc_number, \
            senior_reviewing_clinician) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11) RETURNING *",
        )
        .bind(self.casualty_card_id)
        .bind(&self.safeguarding_concern)
        .bind(&self.safeguarding_type)
        .bind(&self.referral_made)
        .bind(&self.mental_capacity_assessment)
        .bind(&self.mental_health_act_status)
        .bind(&self.consent_for_treatment)
        .bind(&self.completed_by_name)
        .bind(&self.completed_by_role)
        .bind(&self.completed_by_gmc_number)
        .bind(&self.senior_reviewing_clinician)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE casualty_card_safeguarding_consents SET casualty_card_id = $2, \
            safeguarding_concern = $3, safeguarding_type = $4, referral_made = $5, \
            mental_capacity_assessment = $6, mental_health_act_status = $7, \
            consent_for_treatment = $8, completed_by_name = $9, completed_by_role = $10, \
            completed_by_gmc_number = $11, senior_reviewing_clinician = $12, updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.casualty_card_id)
        .bind(&self.safeguarding_concern)
        .bind(&self.safeguarding_type)
        .bind(&self.referral_made)
        .bind(&self.mental_capacity_assessment)
        .bind(&self.mental_health_act_status)
        .bind(&self.consent_for_treatment)
        .bind(&self.completed_by_name)
        .bind(&self.completed_by_role)
        .bind(&self.completed_by_gmc_number)
        .bind(&self.senior_reviewing_clinician)
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
        .prefix("api/casualty_card_safeguarding_consents/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
