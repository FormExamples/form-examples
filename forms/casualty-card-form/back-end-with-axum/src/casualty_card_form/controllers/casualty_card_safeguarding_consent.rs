#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::casualty_card_safeguarding_consents::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
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
            "INSERT INTO casualty_card_safeguarding_consents (deleted_at, casualty_card_id, \
            safeguarding_concern, safeguarding_type, referral_made, \
            mental_capacity_assessment, mental_health_act_status, consent_for_treatment, \
            completed_by_name, completed_by_role, completed_by_gmc_number, \
            senior_reviewing_clinician) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12) RETURNING *",
        )
        .bind(self.deleted_at)
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
            "UPDATE casualty_card_safeguarding_consents SET deleted_at = $2, casualty_card_id \
            = $3, safeguarding_concern = $4, safeguarding_type = $5, referral_made = $6, \
            mental_capacity_assessment = $7, mental_health_act_status = $8, \
            consent_for_treatment = $9, completed_by_name = $10, completed_by_role = $11, \
            completed_by_gmc_number = $12, senior_reviewing_clinician = $13, updated_at = \
            now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
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
        .prefix("api/casualty_card_safeguarding_consents/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
