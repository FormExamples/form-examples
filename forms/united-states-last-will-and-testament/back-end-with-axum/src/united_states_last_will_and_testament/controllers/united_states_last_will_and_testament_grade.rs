#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_states_last_will_and_testament_grades::Model;
use crate::support::validation::unprocessable;

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub united_states_last_will_and_testament_id: Uuid,
    pub validity_class: String,
    #[validate(range(min = -9999.99, max = 9999.99))]
    pub residuary_percent_total: Option<f64>,
    #[validate(range(min = -999999999999.99, max = 999999999999.99))]
    pub elective_share_amount: Option<f64>,
    pub witness_count: Option<i32>,
    pub self_proved: String,
    pub federal_estate_tax_exposure: String,
    pub state_rule_source: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_states_last_will_and_testament_grades \
            (united_states_last_will_and_testament_id, validity_class, \
            residuary_percent_total, elective_share_amount, witness_count, self_proved, \
            federal_estate_tax_exposure, state_rule_source, graded_at) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(self.united_states_last_will_and_testament_id)
        .bind(&self.validity_class)
        .bind(self.residuary_percent_total)
        .bind(self.elective_share_amount)
        .bind(self.witness_count)
        .bind(&self.self_proved)
        .bind(&self.federal_estate_tax_exposure)
        .bind(&self.state_rule_source)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_states_last_will_and_testament_grades SET \
            united_states_last_will_and_testament_id = $2, validity_class = $3, \
            residuary_percent_total = $4, elective_share_amount = $5, witness_count = $6, \
            self_proved = $7, federal_estate_tax_exposure = $8, state_rule_source = $9, \
            graded_at = $10, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            *",
        )
        .bind(id)
        .bind(self.united_states_last_will_and_testament_id)
        .bind(&self.validity_class)
        .bind(self.residuary_percent_total)
        .bind(self.elective_share_amount)
        .bind(self.witness_count)
        .bind(&self.self_proved)
        .bind(&self.federal_estate_tax_exposure)
        .bind(&self.state_rule_source)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
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
        .prefix("api/united_states_last_will_and_testament_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
