//! United states divorce petition module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_states_divorce_petitions::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Petitioner id.
    pub petitioner_id: Uuid,
    /// Attorney id.
    pub attorney_id: Option<Uuid>,
    /// State.
    pub state: String,
    /// County.
    #[validate(length(max = TEXT_MAX))]
    pub county: String,
    /// Filing date.
    #[validate(custom(function = "plausible_date"))]
    pub filing_date: Option<Date>,
    /// Case type.
    pub case_type: String,
    /// Ground type.
    pub ground_type: String,
    /// Fault ground.
    pub fault_ground: String,
    /// Petitioner name.
    #[validate(length(max = TEXT_MAX))]
    pub petitioner_name: String,
    /// Respondent name.
    #[validate(length(max = TEXT_MAX))]
    pub respondent_name: String,
    /// Marriage date.
    #[validate(custom(function = "plausible_date"))]
    pub marriage_date: Option<Date>,
    /// Marriage place.
    #[validate(length(max = TEXT_MAX))]
    pub marriage_place: String,
    /// Separation date.
    #[validate(custom(function = "plausible_date"))]
    pub separation_date: Option<Date>,
    /// Petitioner residency months.
    pub petitioner_residency_months: Option<i32>,
    /// County residency days.
    pub county_residency_days: Option<i32>,
    /// Married or lived in state.
    pub married_or_lived_in_state: String,
    /// Respondent military.
    pub respondent_military: String,
    /// Has minor children.
    pub has_minor_children: String,
    /// Children count.
    pub children_count: Option<i32>,
    /// Children home state months.
    pub children_home_state_months: Option<i32>,
    /// Pregnant.
    pub pregnant: String,
    /// Custody plan documented.
    pub custody_plan_documented: String,
    /// Child support worksheet completed.
    pub child_support_worksheet_completed: String,
    /// Child support monthly amount.
    #[validate(range(min = -99999999.99, max = 99999999.99))]
    pub child_support_monthly_amount: Option<f64>,
    /// Property division approach.
    pub property_division_approach: String,
    /// Settlement agreement signed.
    pub settlement_agreement_signed: String,
    /// Financial disclosure filed.
    pub financial_disclosure_filed: String,
    /// Spousal support requested.
    pub spousal_support_requested: String,
    /// Service method.
    pub service_method: String,
    /// Service date.
    #[validate(custom(function = "plausible_date"))]
    pub service_date: Option<Date>,
    /// Respondent responded.
    pub respondent_responded: String,
    /// Decree entered.
    pub decree_entered: String,
    /// Decree date.
    #[validate(custom(function = "plausible_date"))]
    pub decree_date: Option<Date>,
    /// Name restoration requested.
    pub name_restoration_requested: String,
    /// Name to restore.
    #[validate(length(max = TEXT_MAX))]
    pub name_to_restore: String,
    /// Certificate requested.
    pub certificate_requested: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_states_divorce_petitions (petitioner_id, attorney_id, \
            state, county, filing_date, case_type, ground_type, fault_ground, \
            petitioner_name, respondent_name, marriage_date, marriage_place, \
            separation_date, petitioner_residency_months, county_residency_days, \
            married_or_lived_in_state, respondent_military, has_minor_children, \
            children_count, children_home_state_months, pregnant, \
            custody_plan_documented, child_support_worksheet_completed, \
            child_support_monthly_amount, property_division_approach, \
            settlement_agreement_signed, financial_disclosure_filed, \
            spousal_support_requested, service_method, service_date, \
            respondent_responded, decree_entered, decree_date, \
            name_restoration_requested, name_to_restore, certificate_requested) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, \
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, \
            $33, $34, $35, $36) RETURNING *",
        )
        .bind(self.petitioner_id)
        .bind(self.attorney_id)
        .bind(&self.state)
        .bind(&self.county)
        .bind(self.filing_date)
        .bind(&self.case_type)
        .bind(&self.ground_type)
        .bind(&self.fault_ground)
        .bind(&self.petitioner_name)
        .bind(&self.respondent_name)
        .bind(self.marriage_date)
        .bind(&self.marriage_place)
        .bind(self.separation_date)
        .bind(self.petitioner_residency_months)
        .bind(self.county_residency_days)
        .bind(&self.married_or_lived_in_state)
        .bind(&self.respondent_military)
        .bind(&self.has_minor_children)
        .bind(self.children_count)
        .bind(self.children_home_state_months)
        .bind(&self.pregnant)
        .bind(&self.custody_plan_documented)
        .bind(&self.child_support_worksheet_completed)
        .bind(self.child_support_monthly_amount)
        .bind(&self.property_division_approach)
        .bind(&self.settlement_agreement_signed)
        .bind(&self.financial_disclosure_filed)
        .bind(&self.spousal_support_requested)
        .bind(&self.service_method)
        .bind(self.service_date)
        .bind(&self.respondent_responded)
        .bind(&self.decree_entered)
        .bind(self.decree_date)
        .bind(&self.name_restoration_requested)
        .bind(&self.name_to_restore)
        .bind(&self.certificate_requested)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_states_divorce_petitions SET petitioner_id = $2, attorney_id = \
            $3, state = $4, county = $5, filing_date = $6, case_type = $7, ground_type = \
            $8, fault_ground = $9, petitioner_name = $10, respondent_name = $11, \
            marriage_date = $12, marriage_place = $13, separation_date = $14, \
            petitioner_residency_months = $15, county_residency_days = $16, \
            married_or_lived_in_state = $17, respondent_military = $18, \
            has_minor_children = $19, children_count = $20, children_home_state_months = \
            $21, pregnant = $22, custody_plan_documented = $23, \
            child_support_worksheet_completed = $24, child_support_monthly_amount = $25, \
            property_division_approach = $26, settlement_agreement_signed = $27, \
            financial_disclosure_filed = $28, spousal_support_requested = $29, \
            service_method = $30, service_date = $31, respondent_responded = $32, \
            decree_entered = $33, decree_date = $34, name_restoration_requested = $35, \
            name_to_restore = $36, certificate_requested = $37, updated_at = now() WHERE \
            id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.petitioner_id)
        .bind(self.attorney_id)
        .bind(&self.state)
        .bind(&self.county)
        .bind(self.filing_date)
        .bind(&self.case_type)
        .bind(&self.ground_type)
        .bind(&self.fault_ground)
        .bind(&self.petitioner_name)
        .bind(&self.respondent_name)
        .bind(self.marriage_date)
        .bind(&self.marriage_place)
        .bind(self.separation_date)
        .bind(self.petitioner_residency_months)
        .bind(self.county_residency_days)
        .bind(&self.married_or_lived_in_state)
        .bind(&self.respondent_military)
        .bind(&self.has_minor_children)
        .bind(self.children_count)
        .bind(self.children_home_state_months)
        .bind(&self.pregnant)
        .bind(&self.custody_plan_documented)
        .bind(&self.child_support_worksheet_completed)
        .bind(self.child_support_monthly_amount)
        .bind(&self.property_division_approach)
        .bind(&self.settlement_agreement_signed)
        .bind(&self.financial_disclosure_filed)
        .bind(&self.spousal_support_requested)
        .bind(&self.service_method)
        .bind(self.service_date)
        .bind(&self.respondent_responded)
        .bind(&self.decree_entered)
        .bind(self.decree_date)
        .bind(&self.name_restoration_requested)
        .bind(&self.name_to_restore)
        .bind(&self.certificate_requested)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
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

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/united_states_divorce_petitions/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
