#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_states_durable_financial_power_of_attorneys::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub principal_id: Uuid,
    pub agent_id: Option<Uuid>,
    #[validate(length(max = TEXT_MAX))]
    pub principal_name: String,
    #[validate(custom(function = "plausible_date"))]
    pub date_of_birth: Option<Date>,
    pub state: String,
    #[serde(default)]
    pub principal_address: Option<String>,
    #[serde(default)]
    pub capacity_confirmed: Option<String>,
    #[serde(default)]
    pub durable_statement: Option<String>,
    #[serde(default)]
    pub effectiveness: Option<String>,
    #[serde(default)]
    pub springing_trigger: Option<String>,
    #[serde(default)]
    pub statutory_notice_included: Option<String>,
    #[serde(default)]
    pub agent_name: Option<String>,
    #[serde(default)]
    pub agent_relationship: Option<String>,
    #[serde(default)]
    pub agent_is_adult: Option<String>,
    #[serde(default)]
    pub agent_signed_acknowledgment: Option<String>,
    #[serde(default)]
    pub successor_agent_name: Option<String>,
    #[serde(default)]
    pub co_agents_mode: Option<String>,
    #[serde(default)]
    pub compensation: Option<String>,
    #[serde(default)]
    pub compensation_amount: Option<f64>,
    #[serde(default)]
    pub grant_banking: Option<String>,
    #[serde(default)]
    pub grant_real_estate: Option<String>,
    #[serde(default)]
    pub grant_investments: Option<String>,
    #[serde(default)]
    pub grant_business: Option<String>,
    #[serde(default)]
    pub grant_insurance: Option<String>,
    #[serde(default)]
    pub grant_tax_matters: Option<String>,
    #[serde(default)]
    pub grant_benefits: Option<String>,
    #[serde(default)]
    pub grant_retirement: Option<String>,
    #[serde(default)]
    pub grant_claims: Option<String>,
    #[serde(default)]
    pub grant_personal_property: Option<String>,
    #[serde(default)]
    pub hot_create_trust: Option<String>,
    #[serde(default)]
    pub hot_gift: Option<String>,
    #[serde(default)]
    pub hot_survivorship: Option<String>,
    #[serde(default)]
    pub hot_beneficiary: Option<String>,
    #[serde(default)]
    pub hot_delegate: Option<String>,
    #[serde(default)]
    pub hot_annuity_waiver: Option<String>,
    #[serde(default)]
    pub hot_disclaim: Option<String>,
    #[serde(default)]
    pub hot_powers_initialed: Option<String>,
    #[serde(default)]
    pub gift_limit_type: Option<String>,
    #[serde(default)]
    pub gift_limit_amount: Option<f64>,
    #[serde(default)]
    pub self_gifting_allowed: Option<String>,
    #[serde(default)]
    pub notary_arranged: Option<String>,
    #[serde(default)]
    pub witness_count: Option<i32>,
    #[serde(default)]
    pub witness_is_agent: Option<String>,
    #[serde(default)]
    pub used_for_real_estate: Option<String>,
    #[serde(default)]
    pub bank_form_completed: Option<String>,
    #[serde(default)]
    pub form2848_status: Option<String>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_states_durable_financial_power_of_attorneys \
            (principal_id, agent_id, principal_name, date_of_birth, state, \
            principal_address, capacity_confirmed, durable_statement, effectiveness, \
            springing_trigger, statutory_notice_included, agent_name, \
            agent_relationship, agent_is_adult, agent_signed_acknowledgment, \
            successor_agent_name, co_agents_mode, compensation, compensation_amount, \
            grant_banking, grant_real_estate, grant_investments, grant_business, \
            grant_insurance, grant_tax_matters, grant_benefits, grant_retirement, \
            grant_claims, grant_personal_property, hot_create_trust, hot_gift, \
            hot_survivorship, hot_beneficiary, hot_delegate, hot_annuity_waiver, \
            hot_disclaim, hot_powers_initialed, gift_limit_type, gift_limit_amount, \
            self_gifting_allowed, notary_arranged, witness_count, witness_is_agent, \
            used_for_real_estate, bank_form_completed, form2848_status) VALUES ($1, $2, \
            $3, $4, $5, COALESCE($6, ''), COALESCE($7, ''), COALESCE($8, ''), \
            COALESCE($9, ''), COALESCE($10, ''), COALESCE($11, ''), COALESCE($12, ''), \
            COALESCE($13, ''), COALESCE($14, ''), COALESCE($15, ''), COALESCE($16, ''), \
            COALESCE($17, ''), COALESCE($18, ''), $19, COALESCE($20, ''), COALESCE($21, \
            ''), COALESCE($22, ''), COALESCE($23, ''), COALESCE($24, ''), COALESCE($25, \
            ''), COALESCE($26, ''), COALESCE($27, ''), COALESCE($28, ''), COALESCE($29, \
            ''), COALESCE($30, ''), COALESCE($31, ''), COALESCE($32, ''), COALESCE($33, \
            ''), COALESCE($34, ''), COALESCE($35, ''), COALESCE($36, ''), COALESCE($37, \
            ''), COALESCE($38, ''), $39, COALESCE($40, ''), COALESCE($41, ''), $42, \
            COALESCE($43, ''), COALESCE($44, ''), COALESCE($45, ''), COALESCE($46, '')) \
            RETURNING *",
        )
        .bind(self.principal_id)
        .bind(self.agent_id)
        .bind(&self.principal_name)
        .bind(self.date_of_birth)
        .bind(&self.state)
        .bind(&self.principal_address)
        .bind(&self.capacity_confirmed)
        .bind(&self.durable_statement)
        .bind(&self.effectiveness)
        .bind(&self.springing_trigger)
        .bind(&self.statutory_notice_included)
        .bind(&self.agent_name)
        .bind(&self.agent_relationship)
        .bind(&self.agent_is_adult)
        .bind(&self.agent_signed_acknowledgment)
        .bind(&self.successor_agent_name)
        .bind(&self.co_agents_mode)
        .bind(&self.compensation)
        .bind(self.compensation_amount)
        .bind(&self.grant_banking)
        .bind(&self.grant_real_estate)
        .bind(&self.grant_investments)
        .bind(&self.grant_business)
        .bind(&self.grant_insurance)
        .bind(&self.grant_tax_matters)
        .bind(&self.grant_benefits)
        .bind(&self.grant_retirement)
        .bind(&self.grant_claims)
        .bind(&self.grant_personal_property)
        .bind(&self.hot_create_trust)
        .bind(&self.hot_gift)
        .bind(&self.hot_survivorship)
        .bind(&self.hot_beneficiary)
        .bind(&self.hot_delegate)
        .bind(&self.hot_annuity_waiver)
        .bind(&self.hot_disclaim)
        .bind(&self.hot_powers_initialed)
        .bind(&self.gift_limit_type)
        .bind(self.gift_limit_amount)
        .bind(&self.self_gifting_allowed)
        .bind(&self.notary_arranged)
        .bind(self.witness_count)
        .bind(&self.witness_is_agent)
        .bind(&self.used_for_real_estate)
        .bind(&self.bank_form_completed)
        .bind(&self.form2848_status)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_states_durable_financial_power_of_attorneys SET principal_id = \
            $2, agent_id = $3, principal_name = $4, date_of_birth = $5, state = $6, \
            principal_address = COALESCE($7, principal_address), capacity_confirmed = \
            COALESCE($8, capacity_confirmed), durable_statement = COALESCE($9, \
            durable_statement), effectiveness = COALESCE($10, effectiveness), \
            springing_trigger = COALESCE($11, springing_trigger), \
            statutory_notice_included = COALESCE($12, statutory_notice_included), \
            agent_name = COALESCE($13, agent_name), agent_relationship = COALESCE($14, \
            agent_relationship), agent_is_adult = COALESCE($15, agent_is_adult), \
            agent_signed_acknowledgment = COALESCE($16, agent_signed_acknowledgment), \
            successor_agent_name = COALESCE($17, successor_agent_name), co_agents_mode = \
            COALESCE($18, co_agents_mode), compensation = COALESCE($19, compensation), \
            compensation_amount = $20, grant_banking = COALESCE($21, grant_banking), \
            grant_real_estate = COALESCE($22, grant_real_estate), grant_investments = \
            COALESCE($23, grant_investments), grant_business = COALESCE($24, \
            grant_business), grant_insurance = COALESCE($25, grant_insurance), \
            grant_tax_matters = COALESCE($26, grant_tax_matters), grant_benefits = \
            COALESCE($27, grant_benefits), grant_retirement = COALESCE($28, \
            grant_retirement), grant_claims = COALESCE($29, grant_claims), \
            grant_personal_property = COALESCE($30, grant_personal_property), \
            hot_create_trust = COALESCE($31, hot_create_trust), hot_gift = COALESCE($32, \
            hot_gift), hot_survivorship = COALESCE($33, hot_survivorship), \
            hot_beneficiary = COALESCE($34, hot_beneficiary), hot_delegate = \
            COALESCE($35, hot_delegate), hot_annuity_waiver = COALESCE($36, \
            hot_annuity_waiver), hot_disclaim = COALESCE($37, hot_disclaim), \
            hot_powers_initialed = COALESCE($38, hot_powers_initialed), gift_limit_type \
            = COALESCE($39, gift_limit_type), gift_limit_amount = $40, \
            self_gifting_allowed = COALESCE($41, self_gifting_allowed), notary_arranged \
            = COALESCE($42, notary_arranged), witness_count = $43, witness_is_agent = \
            COALESCE($44, witness_is_agent), used_for_real_estate = COALESCE($45, \
            used_for_real_estate), bank_form_completed = COALESCE($46, \
            bank_form_completed), form2848_status = COALESCE($47, form2848_status), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.principal_id)
        .bind(self.agent_id)
        .bind(&self.principal_name)
        .bind(self.date_of_birth)
        .bind(&self.state)
        .bind(&self.principal_address)
        .bind(&self.capacity_confirmed)
        .bind(&self.durable_statement)
        .bind(&self.effectiveness)
        .bind(&self.springing_trigger)
        .bind(&self.statutory_notice_included)
        .bind(&self.agent_name)
        .bind(&self.agent_relationship)
        .bind(&self.agent_is_adult)
        .bind(&self.agent_signed_acknowledgment)
        .bind(&self.successor_agent_name)
        .bind(&self.co_agents_mode)
        .bind(&self.compensation)
        .bind(self.compensation_amount)
        .bind(&self.grant_banking)
        .bind(&self.grant_real_estate)
        .bind(&self.grant_investments)
        .bind(&self.grant_business)
        .bind(&self.grant_insurance)
        .bind(&self.grant_tax_matters)
        .bind(&self.grant_benefits)
        .bind(&self.grant_retirement)
        .bind(&self.grant_claims)
        .bind(&self.grant_personal_property)
        .bind(&self.hot_create_trust)
        .bind(&self.hot_gift)
        .bind(&self.hot_survivorship)
        .bind(&self.hot_beneficiary)
        .bind(&self.hot_delegate)
        .bind(&self.hot_annuity_waiver)
        .bind(&self.hot_disclaim)
        .bind(&self.hot_powers_initialed)
        .bind(&self.gift_limit_type)
        .bind(self.gift_limit_amount)
        .bind(&self.self_gifting_allowed)
        .bind(&self.notary_arranged)
        .bind(self.witness_count)
        .bind(&self.witness_is_agent)
        .bind(&self.used_for_real_estate)
        .bind(&self.bank_form_completed)
        .bind(&self.form2848_status)
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
        .prefix("api/united-states-durable-financial-power-of-attorney/united_states_durable_financial_power_of_attorneys/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
