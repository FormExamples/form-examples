#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_states_standard_certificate_of_deaths::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    #[validate(length(max = TEXT_MAX))]
    pub certifier_name: String,
    pub certifier_type: String,
    pub certifier_license_number: String,
    #[validate(length(max = TEXT_MAX))]
    pub disposition_place: String,
    #[validate(custom(function = "plausible_date"))]
    pub certification_date: Option<Date>,
    pub attended_deceased: String,
    #[validate(custom(function = "plausible_date"))]
    pub last_seen_alive_date: Option<Date>,
    #[validate(length(max = TEXT_MAX))]
    pub decedent_name: String,
    pub sex: String,
    #[validate(custom(function = "plausible_date"))]
    pub date_of_birth: Option<Date>,
    pub age_years: Option<i32>,
    pub marital_status: String,
    #[validate(custom(function = "plausible_date"))]
    pub date_of_death: Option<Date>,
    pub time_of_death: Option<String>,
    #[validate(length(max = TEXT_MAX))]
    pub place_of_death_facility: String,
    pub place_of_death_type: String,
    #[validate(length(max = TEXT_MAX))]
    pub cause_ia_condition: String,
    #[validate(length(max = TEXT_MAX))]
    pub cause_ia_interval: String,
    #[validate(length(max = TEXT_MAX))]
    pub cause_ib_condition: String,
    #[validate(length(max = TEXT_MAX))]
    pub cause_ib_interval: String,
    #[validate(length(max = TEXT_MAX))]
    pub cause_ic_condition: String,
    #[validate(length(max = TEXT_MAX))]
    pub cause_ic_interval: String,
    #[validate(length(max = TEXT_MAX))]
    pub part_ii_conditions: String,
    #[validate(length(max = TEXT_MAX))]
    pub injury_description: String,
    pub referred_to_medical_examiner: String,
    pub referral_reason: String,
    pub manner_of_death: String,
    #[validate(length(max = TEXT_MAX))]
    pub certifier_note: String,
    #[serde(default)]
    pub state: Option<String>,
    #[serde(default)]
    pub veteran_status: Option<String>,
    #[serde(default)]
    pub state_of_residence: Option<String>,
    #[serde(default)]
    pub cause_id_condition: Option<String>,
    #[serde(default)]
    pub cause_id_interval: Option<String>,
    #[serde(default)]
    pub autopsy_performed: Option<String>,
    #[serde(default)]
    pub autopsy_findings_available: Option<String>,
    #[serde(default)]
    pub tobacco_use_contributed: Option<String>,
    #[serde(default)]
    pub pregnancy_status: Option<String>,
    #[serde(default)]
    pub injury_date: Option<Date>,
    #[serde(default)]
    pub injury_time: Option<Time>,
    #[serde(default)]
    pub injury_place: Option<String>,
    #[serde(default)]
    pub injury_at_work: Option<String>,
    #[serde(default)]
    pub injury_location: Option<String>,
    #[serde(default)]
    pub transportation_injury_role: Option<String>,
    #[serde(default)]
    pub funeral_director_name: Option<String>,
    #[serde(default)]
    pub funeral_director_license_number: Option<String>,
    #[serde(default)]
    pub disposition_method: Option<String>,
    #[serde(default)]
    pub disposition_date: Option<Date>,
    #[serde(default)]
    pub filed_date: Option<Date>,
    #[serde(default)]
    pub certified_copies_requested: Option<i32>,
    #[serde(default)]
    pub requester_relationship: Option<String>,
    #[serde(default)]
    pub requester_identity_verified: Option<String>,
    #[serde(default)]
    pub fee_paid_in_usd: Option<f64>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_states_standard_certificate_of_deaths (patient_id, \
            clinician_id, certifier_name, certifier_type, certifier_license_number, \
            disposition_place, certification_date, attended_deceased, \
            last_seen_alive_date, decedent_name, sex, date_of_birth, age_years, \
            marital_status, date_of_death, time_of_death, place_of_death_facility, \
            place_of_death_type, cause_ia_condition, cause_ia_interval, \
            cause_ib_condition, cause_ib_interval, cause_ic_condition, \
            cause_ic_interval, part_ii_conditions, injury_description, \
            referred_to_medical_examiner, referral_reason, manner_of_death, \
            certifier_note, state, veteran_status, state_of_residence, \
            cause_id_condition, cause_id_interval, autopsy_performed, \
            autopsy_findings_available, tobacco_use_contributed, pregnancy_status, \
            injury_date, injury_time, injury_place, injury_at_work, injury_location, \
            transportation_injury_role, funeral_director_name, \
            funeral_director_license_number, disposition_method, disposition_date, \
            filed_date, certified_copies_requested, requester_relationship, \
            requester_identity_verified, fee_paid_in_usd) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, \
            $22, $23, $24, $25, $26, $27, $28, $29, $30, COALESCE($31, ''), \
            COALESCE($32, ''), COALESCE($33, ''), COALESCE($34, ''), COALESCE($35, ''), \
            COALESCE($36, ''), COALESCE($37, ''), COALESCE($38, ''), COALESCE($39, ''), \
            $40, $41, COALESCE($42, ''), COALESCE($43, ''), COALESCE($44, ''), \
            COALESCE($45, ''), COALESCE($46, ''), COALESCE($47, ''), COALESCE($48, ''), \
            $49, $50, $51, COALESCE($52, ''), COALESCE($53, ''), $54) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.certifier_name)
        .bind(&self.certifier_type)
        .bind(&self.certifier_license_number)
        .bind(&self.disposition_place)
        .bind(self.certification_date)
        .bind(&self.attended_deceased)
        .bind(self.last_seen_alive_date)
        .bind(&self.decedent_name)
        .bind(&self.sex)
        .bind(self.date_of_birth)
        .bind(self.age_years)
        .bind(&self.marital_status)
        .bind(self.date_of_death)
        .bind(&self.time_of_death)
        .bind(&self.place_of_death_facility)
        .bind(&self.place_of_death_type)
        .bind(&self.cause_ia_condition)
        .bind(&self.cause_ia_interval)
        .bind(&self.cause_ib_condition)
        .bind(&self.cause_ib_interval)
        .bind(&self.cause_ic_condition)
        .bind(&self.cause_ic_interval)
        .bind(&self.part_ii_conditions)
        .bind(&self.injury_description)
        .bind(&self.referred_to_medical_examiner)
        .bind(&self.referral_reason)
        .bind(&self.manner_of_death)
        .bind(&self.certifier_note)
        .bind(&self.state)
        .bind(&self.veteran_status)
        .bind(&self.state_of_residence)
        .bind(&self.cause_id_condition)
        .bind(&self.cause_id_interval)
        .bind(&self.autopsy_performed)
        .bind(&self.autopsy_findings_available)
        .bind(&self.tobacco_use_contributed)
        .bind(&self.pregnancy_status)
        .bind(&self.injury_date)
        .bind(&self.injury_time)
        .bind(&self.injury_place)
        .bind(&self.injury_at_work)
        .bind(&self.injury_location)
        .bind(&self.transportation_injury_role)
        .bind(&self.funeral_director_name)
        .bind(&self.funeral_director_license_number)
        .bind(&self.disposition_method)
        .bind(&self.disposition_date)
        .bind(&self.filed_date)
        .bind(self.certified_copies_requested)
        .bind(&self.requester_relationship)
        .bind(&self.requester_identity_verified)
        .bind(self.fee_paid_in_usd)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_states_standard_certificate_of_deaths SET patient_id = $2, \
            clinician_id = $3, certifier_name = $4, certifier_type = $5, \
            certifier_license_number = $6, disposition_place = $7, certification_date = \
            $8, attended_deceased = $9, last_seen_alive_date = $10, decedent_name = $11, \
            sex = $12, date_of_birth = $13, age_years = $14, marital_status = $15, \
            date_of_death = $16, time_of_death = $17, place_of_death_facility = $18, \
            place_of_death_type = $19, cause_ia_condition = $20, cause_ia_interval = \
            $21, cause_ib_condition = $22, cause_ib_interval = $23, cause_ic_condition = \
            $24, cause_ic_interval = $25, part_ii_conditions = $26, injury_description = \
            $27, referred_to_medical_examiner = $28, referral_reason = $29, \
            manner_of_death = $30, certifier_note = $31, state = COALESCE($32, state), \
            veteran_status = COALESCE($33, veteran_status), state_of_residence = \
            COALESCE($34, state_of_residence), cause_id_condition = COALESCE($35, \
            cause_id_condition), cause_id_interval = COALESCE($36, cause_id_interval), \
            autopsy_performed = COALESCE($37, autopsy_performed), \
            autopsy_findings_available = COALESCE($38, autopsy_findings_available), \
            tobacco_use_contributed = COALESCE($39, tobacco_use_contributed), \
            pregnancy_status = COALESCE($40, pregnancy_status), injury_date = $41, \
            injury_time = $42, injury_place = COALESCE($43, injury_place), \
            injury_at_work = COALESCE($44, injury_at_work), injury_location = \
            COALESCE($45, injury_location), transportation_injury_role = COALESCE($46, \
            transportation_injury_role), funeral_director_name = COALESCE($47, \
            funeral_director_name), funeral_director_license_number = COALESCE($48, \
            funeral_director_license_number), disposition_method = COALESCE($49, \
            disposition_method), disposition_date = $50, filed_date = $51, \
            certified_copies_requested = $52, requester_relationship = COALESCE($53, \
            requester_relationship), requester_identity_verified = COALESCE($54, \
            requester_identity_verified), fee_paid_in_usd = $55, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.certifier_name)
        .bind(&self.certifier_type)
        .bind(&self.certifier_license_number)
        .bind(&self.disposition_place)
        .bind(self.certification_date)
        .bind(&self.attended_deceased)
        .bind(self.last_seen_alive_date)
        .bind(&self.decedent_name)
        .bind(&self.sex)
        .bind(self.date_of_birth)
        .bind(self.age_years)
        .bind(&self.marital_status)
        .bind(self.date_of_death)
        .bind(&self.time_of_death)
        .bind(&self.place_of_death_facility)
        .bind(&self.place_of_death_type)
        .bind(&self.cause_ia_condition)
        .bind(&self.cause_ia_interval)
        .bind(&self.cause_ib_condition)
        .bind(&self.cause_ib_interval)
        .bind(&self.cause_ic_condition)
        .bind(&self.cause_ic_interval)
        .bind(&self.part_ii_conditions)
        .bind(&self.injury_description)
        .bind(&self.referred_to_medical_examiner)
        .bind(&self.referral_reason)
        .bind(&self.manner_of_death)
        .bind(&self.certifier_note)
        .bind(&self.state)
        .bind(&self.veteran_status)
        .bind(&self.state_of_residence)
        .bind(&self.cause_id_condition)
        .bind(&self.cause_id_interval)
        .bind(&self.autopsy_performed)
        .bind(&self.autopsy_findings_available)
        .bind(&self.tobacco_use_contributed)
        .bind(&self.pregnancy_status)
        .bind(&self.injury_date)
        .bind(&self.injury_time)
        .bind(&self.injury_place)
        .bind(&self.injury_at_work)
        .bind(&self.injury_location)
        .bind(&self.transportation_injury_role)
        .bind(&self.funeral_director_name)
        .bind(&self.funeral_director_license_number)
        .bind(&self.disposition_method)
        .bind(&self.disposition_date)
        .bind(&self.filed_date)
        .bind(self.certified_copies_requested)
        .bind(&self.requester_relationship)
        .bind(&self.requester_identity_verified)
        .bind(self.fee_paid_in_usd)
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
        .prefix("api/united_states_standard_certificate_of_deaths/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
