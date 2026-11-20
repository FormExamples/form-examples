//! United kingdom divorce application module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_divorce_applications::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Applicant id.
    pub applicant_id: Uuid,
    /// Caseworker id.
    pub caseworker_id: Option<Uuid>,
    /// Application type.
    pub application_type: String,
    /// Application mode.
    pub application_mode: String,
    /// Stage.
    pub stage: String,
    /// As of date.
    #[validate(custom(function = "plausible_date"))]
    pub as_of_date: Option<Date>,
    /// Domestic abuse risk.
    pub domestic_abuse_risk: String,
    /// Marriage date.
    #[validate(custom(function = "plausible_date"))]
    pub marriage_date: Option<Date>,
    /// Marriage place.
    #[validate(length(max = TEXT_MAX))]
    pub marriage_place: String,
    /// Marriage country.
    #[validate(length(max = TEXT_MAX))]
    pub marriage_country: String,
    /// Legally recognised.
    pub legally_recognised: String,
    /// Breakdown confirmed.
    pub breakdown_confirmed: String,
    /// Marriage certificate type.
    pub marriage_certificate_type: String,
    /// Certificate in english.
    pub certificate_in_english: String,
    /// Certified translation.
    pub certified_translation: String,
    /// Name changed.
    pub name_changed: String,
    /// Name change proof.
    pub name_change_proof: String,
    /// Applicant habitual resident.
    pub applicant_habitual_resident: String,
    /// Applicant residence months.
    pub applicant_residence_months: Option<i32>,
    /// Applicant domiciled.
    pub applicant_domiciled: String,
    /// Respondent habitual resident.
    pub respondent_habitual_resident: String,
    /// Respondent domiciled.
    pub respondent_domiciled: String,
    /// Last habitually resident together.
    pub last_habitually_resident_together: String,
    /// Applicant name.
    #[validate(length(max = TEXT_MAX))]
    pub applicant_name: String,
    /// Applicant address.
    #[validate(length(max = TEXT_MAX))]
    pub applicant_address: String,
    /// Applicant email.
    #[validate(length(max = TEXT_MAX))]
    pub applicant_email: String,
    /// Respondent name.
    #[validate(length(max = TEXT_MAX))]
    pub respondent_name: String,
    /// Respondent address.
    #[validate(length(max = TEXT_MAX))]
    pub respondent_address: String,
    /// Respondent email.
    #[validate(length(max = TEXT_MAX))]
    pub respondent_email: String,
    /// Respondent address known.
    pub respondent_address_known: String,
    /// Service method.
    pub service_method: String,
    /// Children under 18.
    pub children_under_18: String,
    /// Children count.
    pub children_count: Option<i32>,
    /// Children arrangements.
    pub children_arrangements: String,
    /// Children note.
    #[validate(length(max = TEXT_MAX))]
    pub children_note: String,
    /// Financial order intended.
    pub financial_order_intended: String,
    /// Financial order applied.
    pub financial_order_applied: String,
    /// Fee status.
    pub fee_status: String,
    /// Application issued date.
    #[validate(custom(function = "plausible_date"))]
    pub application_issued_date: Option<Date>,
    /// Respondent acknowledged.
    pub respondent_acknowledged: String,
    /// Conditional order granted date.
    #[validate(custom(function = "plausible_date"))]
    pub conditional_order_granted_date: Option<Date>,
    /// Final order delay explained.
    pub final_order_delay_explained: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_divorce_applications (applicant_id, \
            caseworker_id, application_type, application_mode, stage, as_of_date, \
            domestic_abuse_risk, marriage_date, marriage_place, marriage_country, \
            legally_recognised, breakdown_confirmed, marriage_certificate_type, \
            certificate_in_english, certified_translation, name_changed, \
            name_change_proof, applicant_habitual_resident, applicant_residence_months, \
            applicant_domiciled, respondent_habitual_resident, respondent_domiciled, \
            last_habitually_resident_together, applicant_name, applicant_address, \
            applicant_email, respondent_name, respondent_address, respondent_email, \
            respondent_address_known, service_method, children_under_18, children_count, \
            children_arrangements, children_note, financial_order_intended, \
            financial_order_applied, fee_status, application_issued_date, \
            respondent_acknowledged, conditional_order_granted_date, \
            final_order_delay_explained) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, \
            $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, \
            $40, $41, $42) RETURNING *",
        )
        .bind(self.applicant_id)
        .bind(self.caseworker_id)
        .bind(&self.application_type)
        .bind(&self.application_mode)
        .bind(&self.stage)
        .bind(self.as_of_date)
        .bind(&self.domestic_abuse_risk)
        .bind(self.marriage_date)
        .bind(&self.marriage_place)
        .bind(&self.marriage_country)
        .bind(&self.legally_recognised)
        .bind(&self.breakdown_confirmed)
        .bind(&self.marriage_certificate_type)
        .bind(&self.certificate_in_english)
        .bind(&self.certified_translation)
        .bind(&self.name_changed)
        .bind(&self.name_change_proof)
        .bind(&self.applicant_habitual_resident)
        .bind(self.applicant_residence_months)
        .bind(&self.applicant_domiciled)
        .bind(&self.respondent_habitual_resident)
        .bind(&self.respondent_domiciled)
        .bind(&self.last_habitually_resident_together)
        .bind(&self.applicant_name)
        .bind(&self.applicant_address)
        .bind(&self.applicant_email)
        .bind(&self.respondent_name)
        .bind(&self.respondent_address)
        .bind(&self.respondent_email)
        .bind(&self.respondent_address_known)
        .bind(&self.service_method)
        .bind(&self.children_under_18)
        .bind(self.children_count)
        .bind(&self.children_arrangements)
        .bind(&self.children_note)
        .bind(&self.financial_order_intended)
        .bind(&self.financial_order_applied)
        .bind(&self.fee_status)
        .bind(self.application_issued_date)
        .bind(&self.respondent_acknowledged)
        .bind(self.conditional_order_granted_date)
        .bind(&self.final_order_delay_explained)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_divorce_applications SET applicant_id = $2, \
            caseworker_id = $3, application_type = $4, application_mode = $5, stage = \
            $6, as_of_date = $7, domestic_abuse_risk = $8, marriage_date = $9, \
            marriage_place = $10, marriage_country = $11, legally_recognised = $12, \
            breakdown_confirmed = $13, marriage_certificate_type = $14, \
            certificate_in_english = $15, certified_translation = $16, name_changed = \
            $17, name_change_proof = $18, applicant_habitual_resident = $19, \
            applicant_residence_months = $20, applicant_domiciled = $21, \
            respondent_habitual_resident = $22, respondent_domiciled = $23, \
            last_habitually_resident_together = $24, applicant_name = $25, \
            applicant_address = $26, applicant_email = $27, respondent_name = $28, \
            respondent_address = $29, respondent_email = $30, respondent_address_known = \
            $31, service_method = $32, children_under_18 = $33, children_count = $34, \
            children_arrangements = $35, children_note = $36, financial_order_intended = \
            $37, financial_order_applied = $38, fee_status = $39, \
            application_issued_date = $40, respondent_acknowledged = $41, \
            conditional_order_granted_date = $42, final_order_delay_explained = $43, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.applicant_id)
        .bind(self.caseworker_id)
        .bind(&self.application_type)
        .bind(&self.application_mode)
        .bind(&self.stage)
        .bind(self.as_of_date)
        .bind(&self.domestic_abuse_risk)
        .bind(self.marriage_date)
        .bind(&self.marriage_place)
        .bind(&self.marriage_country)
        .bind(&self.legally_recognised)
        .bind(&self.breakdown_confirmed)
        .bind(&self.marriage_certificate_type)
        .bind(&self.certificate_in_english)
        .bind(&self.certified_translation)
        .bind(&self.name_changed)
        .bind(&self.name_change_proof)
        .bind(&self.applicant_habitual_resident)
        .bind(self.applicant_residence_months)
        .bind(&self.applicant_domiciled)
        .bind(&self.respondent_habitual_resident)
        .bind(&self.respondent_domiciled)
        .bind(&self.last_habitually_resident_together)
        .bind(&self.applicant_name)
        .bind(&self.applicant_address)
        .bind(&self.applicant_email)
        .bind(&self.respondent_name)
        .bind(&self.respondent_address)
        .bind(&self.respondent_email)
        .bind(&self.respondent_address_known)
        .bind(&self.service_method)
        .bind(&self.children_under_18)
        .bind(self.children_count)
        .bind(&self.children_arrangements)
        .bind(&self.children_note)
        .bind(&self.financial_order_intended)
        .bind(&self.financial_order_applied)
        .bind(&self.fee_status)
        .bind(self.application_issued_date)
        .bind(&self.respondent_acknowledged)
        .bind(self.conditional_order_granted_date)
        .bind(&self.final_order_delay_explained)
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
        .prefix("api/united-kingdom-divorce-application/united_kingdom_divorce_applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
