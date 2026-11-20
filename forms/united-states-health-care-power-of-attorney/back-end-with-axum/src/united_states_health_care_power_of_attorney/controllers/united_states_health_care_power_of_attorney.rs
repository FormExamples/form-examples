#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_states_health_care_power_of_attorneys::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub principal_id: Uuid,
    pub reviewer_id: Option<Uuid>,
    #[validate(length(max = TEXT_MAX))]
    pub principal_name: String,
    #[validate(custom(function = "plausible_date"))]
    pub birth_date: Option<Date>,
    #[validate(length(max = TEXT_MAX))]
    pub agent_name: String,
    #[serde(default)]
    pub state_code: Option<String>,
    #[serde(default)]
    pub phone: Option<String>,
    #[serde(default)]
    pub capacity_confirmed: Option<String>,
    #[serde(default)]
    pub signed_voluntarily: Option<String>,
    #[serde(default)]
    pub agent_relationship: Option<String>,
    #[serde(default)]
    pub agent_age: Option<i32>,
    #[serde(default)]
    pub agent_phone: Option<String>,
    #[serde(default)]
    pub agent_is_health_care_provider: Option<String>,
    #[serde(default)]
    pub agent_is_facility_employee: Option<String>,
    #[serde(default)]
    pub agent_related_to_principal: Option<String>,
    #[serde(default)]
    pub agent_accepted: Option<String>,
    #[serde(default)]
    pub successor1_name: Option<String>,
    #[serde(default)]
    pub successor1_phone: Option<String>,
    #[serde(default)]
    pub successor2_name: Option<String>,
    #[serde(default)]
    pub effective_when: Option<String>,
    #[serde(default)]
    pub incapacity_determined_by: Option<String>,
    #[serde(default)]
    pub hipaa_release: Option<String>,
    #[serde(default)]
    pub mental_health_authority: Option<String>,
    #[serde(default)]
    pub organ_donation: Option<String>,
    #[serde(default)]
    pub prior_directive_status: Option<String>,
    #[serde(default)]
    pub life_sustaining_treatment: Option<String>,
    #[serde(default)]
    pub cpr: Option<String>,
    #[serde(default)]
    pub ventilator: Option<String>,
    #[serde(default)]
    pub artificial_nutrition: Option<String>,
    #[serde(default)]
    pub comfort_care_first: Option<String>,
    #[serde(default)]
    pub serious_illness: Option<String>,
    #[serde(default)]
    pub polst_status: Option<String>,
    #[serde(default)]
    pub wishes_note: Option<String>,
    #[serde(default)]
    pub signature_date: Option<Date>,
    #[serde(default)]
    pub execution_method: Option<String>,
    #[serde(default)]
    pub witnesses_present: Option<String>,
    #[serde(default)]
    pub witness1_name: Option<String>,
    #[serde(default)]
    pub witness1_is_relative: Option<String>,
    #[serde(default)]
    pub witness1_is_heir: Option<String>,
    #[serde(default)]
    pub witness1_is_agent: Option<String>,
    #[serde(default)]
    pub witness1_is_provider: Option<String>,
    #[serde(default)]
    pub witness2_name: Option<String>,
    #[serde(default)]
    pub witness2_is_relative: Option<String>,
    #[serde(default)]
    pub witness2_is_heir: Option<String>,
    #[serde(default)]
    pub witness2_is_agent: Option<String>,
    #[serde(default)]
    pub witness2_is_provider: Option<String>,
    #[serde(default)]
    pub notary_name: Option<String>,
    #[serde(default)]
    pub principal_in_skilled_nursing_facility: Option<String>,
    #[serde(default)]
    pub ombudsman_signed: Option<String>,
    #[serde(default)]
    pub copy_to_agent: Option<String>,
    #[serde(default)]
    pub copy_to_physician: Option<String>,
    #[serde(default)]
    pub copy_to_successor: Option<String>,
    #[serde(default)]
    pub copy_to_facility: Option<String>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_states_health_care_power_of_attorneys (principal_id, \
            reviewer_id, principal_name, birth_date, agent_name, state_code, phone, \
            capacity_confirmed, signed_voluntarily, agent_relationship, agent_age, \
            agent_phone, agent_is_health_care_provider, agent_is_facility_employee, \
            agent_related_to_principal, agent_accepted, successor1_name, \
            successor1_phone, successor2_name, effective_when, incapacity_determined_by, \
            hipaa_release, mental_health_authority, organ_donation, \
            prior_directive_status, life_sustaining_treatment, cpr, ventilator, \
            artificial_nutrition, comfort_care_first, serious_illness, polst_status, \
            wishes_note, signature_date, execution_method, witnesses_present, \
            witness1_name, witness1_is_relative, witness1_is_heir, witness1_is_agent, \
            witness1_is_provider, witness2_name, witness2_is_relative, witness2_is_heir, \
            witness2_is_agent, witness2_is_provider, notary_name, \
            principal_in_skilled_nursing_facility, ombudsman_signed, copy_to_agent, \
            copy_to_physician, copy_to_successor, copy_to_facility) VALUES ($1, $2, $3, \
            $4, $5, COALESCE($6, ''), COALESCE($7, ''), COALESCE($8, ''), COALESCE($9, \
            ''), COALESCE($10, ''), $11, COALESCE($12, ''), COALESCE($13, ''), \
            COALESCE($14, ''), COALESCE($15, ''), COALESCE($16, ''), COALESCE($17, ''), \
            COALESCE($18, ''), COALESCE($19, ''), COALESCE($20, ''), COALESCE($21, ''), \
            COALESCE($22, ''), COALESCE($23, ''), COALESCE($24, ''), COALESCE($25, ''), \
            COALESCE($26, ''), COALESCE($27, ''), COALESCE($28, ''), COALESCE($29, ''), \
            COALESCE($30, ''), COALESCE($31, ''), COALESCE($32, ''), COALESCE($33, ''), \
            $34, COALESCE($35, ''), COALESCE($36, ''), COALESCE($37, ''), COALESCE($38, \
            ''), COALESCE($39, ''), COALESCE($40, ''), COALESCE($41, ''), COALESCE($42, \
            ''), COALESCE($43, ''), COALESCE($44, ''), COALESCE($45, ''), COALESCE($46, \
            ''), COALESCE($47, ''), COALESCE($48, ''), COALESCE($49, ''), COALESCE($50, \
            ''), COALESCE($51, ''), COALESCE($52, ''), COALESCE($53, '')) RETURNING *",
        )
        .bind(self.principal_id)
        .bind(self.reviewer_id)
        .bind(&self.principal_name)
        .bind(self.birth_date)
        .bind(&self.agent_name)
        .bind(&self.state_code)
        .bind(&self.phone)
        .bind(&self.capacity_confirmed)
        .bind(&self.signed_voluntarily)
        .bind(&self.agent_relationship)
        .bind(self.agent_age)
        .bind(&self.agent_phone)
        .bind(&self.agent_is_health_care_provider)
        .bind(&self.agent_is_facility_employee)
        .bind(&self.agent_related_to_principal)
        .bind(&self.agent_accepted)
        .bind(&self.successor1_name)
        .bind(&self.successor1_phone)
        .bind(&self.successor2_name)
        .bind(&self.effective_when)
        .bind(&self.incapacity_determined_by)
        .bind(&self.hipaa_release)
        .bind(&self.mental_health_authority)
        .bind(&self.organ_donation)
        .bind(&self.prior_directive_status)
        .bind(&self.life_sustaining_treatment)
        .bind(&self.cpr)
        .bind(&self.ventilator)
        .bind(&self.artificial_nutrition)
        .bind(&self.comfort_care_first)
        .bind(&self.serious_illness)
        .bind(&self.polst_status)
        .bind(&self.wishes_note)
        .bind(&self.signature_date)
        .bind(&self.execution_method)
        .bind(&self.witnesses_present)
        .bind(&self.witness1_name)
        .bind(&self.witness1_is_relative)
        .bind(&self.witness1_is_heir)
        .bind(&self.witness1_is_agent)
        .bind(&self.witness1_is_provider)
        .bind(&self.witness2_name)
        .bind(&self.witness2_is_relative)
        .bind(&self.witness2_is_heir)
        .bind(&self.witness2_is_agent)
        .bind(&self.witness2_is_provider)
        .bind(&self.notary_name)
        .bind(&self.principal_in_skilled_nursing_facility)
        .bind(&self.ombudsman_signed)
        .bind(&self.copy_to_agent)
        .bind(&self.copy_to_physician)
        .bind(&self.copy_to_successor)
        .bind(&self.copy_to_facility)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_states_health_care_power_of_attorneys SET principal_id = $2, \
            reviewer_id = $3, principal_name = $4, birth_date = $5, agent_name = $6, \
            state_code = COALESCE($7, state_code), phone = COALESCE($8, phone), \
            capacity_confirmed = COALESCE($9, capacity_confirmed), signed_voluntarily = \
            COALESCE($10, signed_voluntarily), agent_relationship = COALESCE($11, \
            agent_relationship), agent_age = $12, agent_phone = COALESCE($13, \
            agent_phone), agent_is_health_care_provider = COALESCE($14, \
            agent_is_health_care_provider), agent_is_facility_employee = COALESCE($15, \
            agent_is_facility_employee), agent_related_to_principal = COALESCE($16, \
            agent_related_to_principal), agent_accepted = COALESCE($17, agent_accepted), \
            successor1_name = COALESCE($18, successor1_name), successor1_phone = \
            COALESCE($19, successor1_phone), successor2_name = COALESCE($20, \
            successor2_name), effective_when = COALESCE($21, effective_when), \
            incapacity_determined_by = COALESCE($22, incapacity_determined_by), \
            hipaa_release = COALESCE($23, hipaa_release), mental_health_authority = \
            COALESCE($24, mental_health_authority), organ_donation = COALESCE($25, \
            organ_donation), prior_directive_status = COALESCE($26, \
            prior_directive_status), life_sustaining_treatment = COALESCE($27, \
            life_sustaining_treatment), cpr = COALESCE($28, cpr), ventilator = \
            COALESCE($29, ventilator), artificial_nutrition = COALESCE($30, \
            artificial_nutrition), comfort_care_first = COALESCE($31, \
            comfort_care_first), serious_illness = COALESCE($32, serious_illness), \
            polst_status = COALESCE($33, polst_status), wishes_note = COALESCE($34, \
            wishes_note), signature_date = $35, execution_method = COALESCE($36, \
            execution_method), witnesses_present = COALESCE($37, witnesses_present), \
            witness1_name = COALESCE($38, witness1_name), witness1_is_relative = \
            COALESCE($39, witness1_is_relative), witness1_is_heir = COALESCE($40, \
            witness1_is_heir), witness1_is_agent = COALESCE($41, witness1_is_agent), \
            witness1_is_provider = COALESCE($42, witness1_is_provider), witness2_name = \
            COALESCE($43, witness2_name), witness2_is_relative = COALESCE($44, \
            witness2_is_relative), witness2_is_heir = COALESCE($45, witness2_is_heir), \
            witness2_is_agent = COALESCE($46, witness2_is_agent), witness2_is_provider = \
            COALESCE($47, witness2_is_provider), notary_name = COALESCE($48, \
            notary_name), principal_in_skilled_nursing_facility = COALESCE($49, \
            principal_in_skilled_nursing_facility), ombudsman_signed = COALESCE($50, \
            ombudsman_signed), copy_to_agent = COALESCE($51, copy_to_agent), \
            copy_to_physician = COALESCE($52, copy_to_physician), copy_to_successor = \
            COALESCE($53, copy_to_successor), copy_to_facility = COALESCE($54, \
            copy_to_facility), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.principal_id)
        .bind(self.reviewer_id)
        .bind(&self.principal_name)
        .bind(self.birth_date)
        .bind(&self.agent_name)
        .bind(&self.state_code)
        .bind(&self.phone)
        .bind(&self.capacity_confirmed)
        .bind(&self.signed_voluntarily)
        .bind(&self.agent_relationship)
        .bind(self.agent_age)
        .bind(&self.agent_phone)
        .bind(&self.agent_is_health_care_provider)
        .bind(&self.agent_is_facility_employee)
        .bind(&self.agent_related_to_principal)
        .bind(&self.agent_accepted)
        .bind(&self.successor1_name)
        .bind(&self.successor1_phone)
        .bind(&self.successor2_name)
        .bind(&self.effective_when)
        .bind(&self.incapacity_determined_by)
        .bind(&self.hipaa_release)
        .bind(&self.mental_health_authority)
        .bind(&self.organ_donation)
        .bind(&self.prior_directive_status)
        .bind(&self.life_sustaining_treatment)
        .bind(&self.cpr)
        .bind(&self.ventilator)
        .bind(&self.artificial_nutrition)
        .bind(&self.comfort_care_first)
        .bind(&self.serious_illness)
        .bind(&self.polst_status)
        .bind(&self.wishes_note)
        .bind(&self.signature_date)
        .bind(&self.execution_method)
        .bind(&self.witnesses_present)
        .bind(&self.witness1_name)
        .bind(&self.witness1_is_relative)
        .bind(&self.witness1_is_heir)
        .bind(&self.witness1_is_agent)
        .bind(&self.witness1_is_provider)
        .bind(&self.witness2_name)
        .bind(&self.witness2_is_relative)
        .bind(&self.witness2_is_heir)
        .bind(&self.witness2_is_agent)
        .bind(&self.witness2_is_provider)
        .bind(&self.notary_name)
        .bind(&self.principal_in_skilled_nursing_facility)
        .bind(&self.ombudsman_signed)
        .bind(&self.copy_to_agent)
        .bind(&self.copy_to_physician)
        .bind(&self.copy_to_successor)
        .bind(&self.copy_to_facility)
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
        .prefix("api/united-states-health-care-power-of-attorney/united_states_health_care_power_of_attorneys/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
