#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::allergy_skin_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub test_type: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub clinical_history: String,
    pub antihistamines_withheld: bool,
    pub positive_control_valid: bool,
    pub allergens_tested: String,
    pub wheal_sizes: String,
    pub specific_ige_results: String,
    pub sensitised_allergens: String,
    pub positive_reactions: bool,
    pub sensitisation_confirmed: bool,
    pub anaphylaxis_during_test: bool,
    pub all_negative: bool,
    pub test_invalid: bool,
    pub interpretation: String,
    pub impression: String,
    pub reporting_category: String,
    pub recommended_follow_up: String,
    pub critical_result_communicated: bool,
    pub reported_to: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO allergy_skin_test_results (patient_id, clinician_id, \
            originating_request_reference, test_type, report_status, performed_date, \
            reported_date, clinical_history, antihistamines_withheld, \
            positive_control_valid, allergens_tested, wheal_sizes, specific_ige_results, \
            sensitised_allergens, positive_reactions, sensitisation_confirmed, \
            anaphylaxis_during_test, all_negative, test_invalid, interpretation, \
            impression, reporting_category, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.test_type)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.clinical_history)
        .bind(self.antihistamines_withheld)
        .bind(self.positive_control_valid)
        .bind(&self.allergens_tested)
        .bind(&self.wheal_sizes)
        .bind(&self.specific_ige_results)
        .bind(&self.sensitised_allergens)
        .bind(self.positive_reactions)
        .bind(self.sensitisation_confirmed)
        .bind(self.anaphylaxis_during_test)
        .bind(self.all_negative)
        .bind(self.test_invalid)
        .bind(&self.interpretation)
        .bind(&self.impression)
        .bind(&self.reporting_category)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE allergy_skin_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, test_type = $5, report_status = $6, \
            performed_date = $7, reported_date = $8, clinical_history = $9, \
            antihistamines_withheld = $10, positive_control_valid = $11, \
            allergens_tested = $12, wheal_sizes = $13, specific_ige_results = $14, \
            sensitised_allergens = $15, positive_reactions = $16, \
            sensitisation_confirmed = $17, anaphylaxis_during_test = $18, all_negative = \
            $19, test_invalid = $20, interpretation = $21, impression = $22, \
            reporting_category = $23, recommended_follow_up = $24, \
            critical_result_communicated = $25, reported_to = $26, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.test_type)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.clinical_history)
        .bind(self.antihistamines_withheld)
        .bind(self.positive_control_valid)
        .bind(&self.allergens_tested)
        .bind(&self.wheal_sizes)
        .bind(&self.specific_ige_results)
        .bind(&self.sensitised_allergens)
        .bind(self.positive_reactions)
        .bind(self.sensitisation_confirmed)
        .bind(self.anaphylaxis_during_test)
        .bind(self.all_negative)
        .bind(self.test_invalid)
        .bind(&self.interpretation)
        .bind(&self.impression)
        .bind(&self.reporting_category)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
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
        .prefix("api/allergy_skin_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
