#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_death_registrations::Model;
use crate::support::validation::unprocessable;

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub informant_id: Option<Uuid>,
    #[serde(default)]
    pub deceased_name: Option<String>,
    #[serde(default)]
    pub sex: Option<String>,
    #[serde(default)]
    pub date_of_birth: Option<Date>,
    #[serde(default)]
    pub date_of_death: Option<Date>,
    #[serde(default)]
    pub place_of_death: Option<String>,
    #[serde(default)]
    pub death_jurisdiction: Option<String>,
    #[serde(default)]
    pub deceased_particulars_known: Option<String>,
    #[serde(default)]
    pub mccd_received: Option<String>,
    #[serde(default)]
    pub medical_examiner_status: Option<String>,
    #[serde(default)]
    pub medical_examiner_confirmation_date: Option<Date>,
    #[serde(default)]
    pub referred_to_coroner: Option<String>,
    #[serde(default)]
    pub coroner_stage: Option<String>,
    #[serde(default)]
    pub coroner_certificate_received: Option<String>,
    #[serde(default)]
    pub informant_name: Option<String>,
    #[serde(default)]
    pub informant_relationship: Option<String>,
    #[serde(default)]
    pub informant_address: Option<String>,
    #[serde(default)]
    pub register_office: Option<String>,
    #[serde(default)]
    pub appointment_booked: Option<String>,
    #[serde(default)]
    pub supporting_documents_available: Option<String>,
    #[serde(default)]
    pub registration_date: Option<Date>,
    #[serde(default)]
    pub as_of_date: Option<Date>,
    #[serde(default)]
    pub disposal_method: Option<String>,
    #[serde(default)]
    pub disposal_certificate_issued: Option<String>,
    #[serde(default)]
    pub tell_us_once_status: Option<String>,
    #[serde(default)]
    pub tell_us_once_reference: Option<String>,
    #[serde(default)]
    pub copies_requested: Option<i32>,
    #[serde(default)]
    pub copy_order_channel: Option<String>,
    #[serde(default)]
    pub gro_index_reference: Option<String>,
    #[serde(default)]
    pub priority_service: Option<String>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_death_registrations (patient_id, informant_id, \
            deceased_name, sex, date_of_birth, date_of_death, place_of_death, \
            death_jurisdiction, deceased_particulars_known, mccd_received, \
            medical_examiner_status, medical_examiner_confirmation_date, \
            referred_to_coroner, coroner_stage, coroner_certificate_received, \
            informant_name, informant_relationship, informant_address, register_office, \
            appointment_booked, supporting_documents_available, registration_date, \
            as_of_date, disposal_method, disposal_certificate_issued, \
            tell_us_once_status, tell_us_once_reference, copies_requested, \
            copy_order_channel, gro_index_reference, priority_service) VALUES ($1, $2, \
            COALESCE($3, ''), COALESCE($4, ''), $5, $6, COALESCE($7, ''), COALESCE($8, \
            ''), COALESCE($9, ''), COALESCE($10, ''), COALESCE($11, ''), $12, \
            COALESCE($13, ''), COALESCE($14, ''), COALESCE($15, ''), COALESCE($16, ''), \
            COALESCE($17, ''), COALESCE($18, ''), COALESCE($19, ''), COALESCE($20, ''), \
            COALESCE($21, ''), $22, $23, COALESCE($24, ''), COALESCE($25, ''), \
            COALESCE($26, ''), COALESCE($27, ''), $28, COALESCE($29, ''), COALESCE($30, \
            ''), COALESCE($31, '')) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.informant_id)
        .bind(&self.deceased_name)
        .bind(&self.sex)
        .bind(&self.date_of_birth)
        .bind(&self.date_of_death)
        .bind(&self.place_of_death)
        .bind(&self.death_jurisdiction)
        .bind(&self.deceased_particulars_known)
        .bind(&self.mccd_received)
        .bind(&self.medical_examiner_status)
        .bind(&self.medical_examiner_confirmation_date)
        .bind(&self.referred_to_coroner)
        .bind(&self.coroner_stage)
        .bind(&self.coroner_certificate_received)
        .bind(&self.informant_name)
        .bind(&self.informant_relationship)
        .bind(&self.informant_address)
        .bind(&self.register_office)
        .bind(&self.appointment_booked)
        .bind(&self.supporting_documents_available)
        .bind(&self.registration_date)
        .bind(&self.as_of_date)
        .bind(&self.disposal_method)
        .bind(&self.disposal_certificate_issued)
        .bind(&self.tell_us_once_status)
        .bind(&self.tell_us_once_reference)
        .bind(self.copies_requested)
        .bind(&self.copy_order_channel)
        .bind(&self.gro_index_reference)
        .bind(&self.priority_service)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_death_registrations SET patient_id = $2, informant_id \
            = $3, deceased_name = COALESCE($4, deceased_name), sex = COALESCE($5, sex), \
            date_of_birth = $6, date_of_death = $7, place_of_death = COALESCE($8, \
            place_of_death), death_jurisdiction = COALESCE($9, death_jurisdiction), \
            deceased_particulars_known = COALESCE($10, deceased_particulars_known), \
            mccd_received = COALESCE($11, mccd_received), medical_examiner_status = \
            COALESCE($12, medical_examiner_status), medical_examiner_confirmation_date = \
            $13, referred_to_coroner = COALESCE($14, referred_to_coroner), coroner_stage \
            = COALESCE($15, coroner_stage), coroner_certificate_received = COALESCE($16, \
            coroner_certificate_received), informant_name = COALESCE($17, \
            informant_name), informant_relationship = COALESCE($18, \
            informant_relationship), informant_address = COALESCE($19, \
            informant_address), register_office = COALESCE($20, register_office), \
            appointment_booked = COALESCE($21, appointment_booked), \
            supporting_documents_available = COALESCE($22, \
            supporting_documents_available), registration_date = $23, as_of_date = $24, \
            disposal_method = COALESCE($25, disposal_method), \
            disposal_certificate_issued = COALESCE($26, disposal_certificate_issued), \
            tell_us_once_status = COALESCE($27, tell_us_once_status), \
            tell_us_once_reference = COALESCE($28, tell_us_once_reference), \
            copies_requested = $29, copy_order_channel = COALESCE($30, \
            copy_order_channel), gro_index_reference = COALESCE($31, \
            gro_index_reference), priority_service = COALESCE($32, priority_service), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.informant_id)
        .bind(&self.deceased_name)
        .bind(&self.sex)
        .bind(&self.date_of_birth)
        .bind(&self.date_of_death)
        .bind(&self.place_of_death)
        .bind(&self.death_jurisdiction)
        .bind(&self.deceased_particulars_known)
        .bind(&self.mccd_received)
        .bind(&self.medical_examiner_status)
        .bind(&self.medical_examiner_confirmation_date)
        .bind(&self.referred_to_coroner)
        .bind(&self.coroner_stage)
        .bind(&self.coroner_certificate_received)
        .bind(&self.informant_name)
        .bind(&self.informant_relationship)
        .bind(&self.informant_address)
        .bind(&self.register_office)
        .bind(&self.appointment_booked)
        .bind(&self.supporting_documents_available)
        .bind(&self.registration_date)
        .bind(&self.as_of_date)
        .bind(&self.disposal_method)
        .bind(&self.disposal_certificate_issued)
        .bind(&self.tell_us_once_status)
        .bind(&self.tell_us_once_reference)
        .bind(self.copies_requested)
        .bind(&self.copy_order_channel)
        .bind(&self.gro_index_reference)
        .bind(&self.priority_service)
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
        .prefix("api/united-kingdom-death-registration/united_kingdom_death_registrations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
