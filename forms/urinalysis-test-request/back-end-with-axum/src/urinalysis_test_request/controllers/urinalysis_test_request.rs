#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::urinalysis_test_requests::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub site_name: String,
    pub setting: String,
    pub referral_date: Option<Date>,
    pub dipstick: bool,
    pub microscopy_culture_sensitivity: bool,
    pub albumin_creatinine_ratio: bool,
    pub protein_creatinine_ratio: bool,
    pub pregnancy_test: bool,
    pub drug_screen: bool,
    pub cytology: bool,
    pub twenty_four_hour_collection: bool,
    pub primary_indication: String,
    pub clinical_details: String,
    pub symptom_dysuria: bool,
    pub symptom_frequency: bool,
    pub symptom_visible_haematuria: bool,
    pub symptom_loin_pain: bool,
    pub symptom_fever: bool,
    pub specimen_type: String,
    pub specimen_collected: String,
    pub collection_datetime: Option<DateTimeWithTimeZone>,
    pub pregnant: bool,
    pub catheterised: bool,
    pub current_antibiotics: bool,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO urinalysis_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, dipstick, microscopy_culture_sensitivity, \
            albumin_creatinine_ratio, protein_creatinine_ratio, pregnancy_test, \
            drug_screen, cytology, twenty_four_hour_collection, primary_indication, \
            clinical_details, symptom_dysuria, symptom_frequency, \
            symptom_visible_haematuria, symptom_loin_pain, symptom_fever, specimen_type, \
            specimen_collected, collection_datetime, pregnant, catheterised, \
            current_antibiotics, urgency, supervising_consultant, requester_contact, \
            notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, \
            $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, \
            $30, $31) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.dipstick)
        .bind(self.microscopy_culture_sensitivity)
        .bind(self.albumin_creatinine_ratio)
        .bind(self.protein_creatinine_ratio)
        .bind(self.pregnancy_test)
        .bind(self.drug_screen)
        .bind(self.cytology)
        .bind(self.twenty_four_hour_collection)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(self.symptom_dysuria)
        .bind(self.symptom_frequency)
        .bind(self.symptom_visible_haematuria)
        .bind(self.symptom_loin_pain)
        .bind(self.symptom_fever)
        .bind(&self.specimen_type)
        .bind(&self.specimen_collected)
        .bind(self.collection_datetime)
        .bind(self.pregnant)
        .bind(self.catheterised)
        .bind(self.current_antibiotics)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE urinalysis_test_requests SET patient_id = $2, clinician_id = $3, \
            status = $4, site_name = $5, setting = $6, referral_date = $7, dipstick = \
            $8, microscopy_culture_sensitivity = $9, albumin_creatinine_ratio = $10, \
            protein_creatinine_ratio = $11, pregnancy_test = $12, drug_screen = $13, \
            cytology = $14, twenty_four_hour_collection = $15, primary_indication = $16, \
            clinical_details = $17, symptom_dysuria = $18, symptom_frequency = $19, \
            symptom_visible_haematuria = $20, symptom_loin_pain = $21, symptom_fever = \
            $22, specimen_type = $23, specimen_collected = $24, collection_datetime = \
            $25, pregnant = $26, catheterised = $27, current_antibiotics = $28, urgency \
            = $29, supervising_consultant = $30, requester_contact = $31, notes = $32, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.dipstick)
        .bind(self.microscopy_culture_sensitivity)
        .bind(self.albumin_creatinine_ratio)
        .bind(self.protein_creatinine_ratio)
        .bind(self.pregnancy_test)
        .bind(self.drug_screen)
        .bind(self.cytology)
        .bind(self.twenty_four_hour_collection)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(self.symptom_dysuria)
        .bind(self.symptom_frequency)
        .bind(self.symptom_visible_haematuria)
        .bind(self.symptom_loin_pain)
        .bind(self.symptom_fever)
        .bind(&self.specimen_type)
        .bind(&self.specimen_collected)
        .bind(self.collection_datetime)
        .bind(self.pregnant)
        .bind(self.catheterised)
        .bind(self.current_antibiotics)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(&self.notes)
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
        .prefix("api/urinalysis_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
