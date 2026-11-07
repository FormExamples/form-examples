#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::blood_test_requests::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub site_name: String,
    pub setting: String,
    pub referral_date: Option<Date>,
    pub full_blood_count: bool,
    pub urea_electrolytes: bool,
    pub liver_function: bool,
    pub thyroid_function: bool,
    pub hba1c: bool,
    pub lipid_profile: bool,
    pub c_reactive_protein: bool,
    pub coagulation_screen: bool,
    pub bone_profile: bool,
    pub ferritin_iron: bool,
    pub vitamin_b12_folate: bool,
    pub vitamin_d: bool,
    pub hba1c_monitoring: bool,
    pub glucose: bool,
    pub inr: bool,
    pub blood_culture: bool,
    pub group_and_save: bool,
    pub crossmatch: bool,
    pub troponin: bool,
    pub d_dimer: bool,
    pub amylase_lipase: bool,
    pub primary_indication: String,
    pub clinical_details: String,
    pub relevant_medications: String,
    pub fasting_required: bool,
    pub fasting_status: String,
    pub specimen_collected: String,
    pub collection_datetime: Option<DateTimeWithTimeZone>,
    pub known_blood_borne_virus: bool,
    pub difficult_venous_access: bool,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO blood_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, full_blood_count, urea_electrolytes, \
            liver_function, thyroid_function, hba1c, lipid_profile, c_reactive_protein, \
            coagulation_screen, bone_profile, ferritin_iron, vitamin_b12_folate, \
            vitamin_d, hba1c_monitoring, glucose, inr, blood_culture, group_and_save, \
            crossmatch, troponin, d_dimer, amylase_lipase, primary_indication, \
            clinical_details, relevant_medications, fasting_required, fasting_status, \
            specimen_collected, collection_datetime, known_blood_borne_virus, \
            difficult_venous_access, urgency, supervising_consultant, requester_contact, \
            notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, \
            $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, \
            $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.full_blood_count)
        .bind(self.urea_electrolytes)
        .bind(self.liver_function)
        .bind(self.thyroid_function)
        .bind(self.hba1c)
        .bind(self.lipid_profile)
        .bind(self.c_reactive_protein)
        .bind(self.coagulation_screen)
        .bind(self.bone_profile)
        .bind(self.ferritin_iron)
        .bind(self.vitamin_b12_folate)
        .bind(self.vitamin_d)
        .bind(self.hba1c_monitoring)
        .bind(self.glucose)
        .bind(self.inr)
        .bind(self.blood_culture)
        .bind(self.group_and_save)
        .bind(self.crossmatch)
        .bind(self.troponin)
        .bind(self.d_dimer)
        .bind(self.amylase_lipase)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(&self.relevant_medications)
        .bind(self.fasting_required)
        .bind(&self.fasting_status)
        .bind(&self.specimen_collected)
        .bind(self.collection_datetime)
        .bind(self.known_blood_borne_virus)
        .bind(self.difficult_venous_access)
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
            "UPDATE blood_test_requests SET patient_id = $2, clinician_id = $3, status = \
            $4, site_name = $5, setting = $6, referral_date = $7, full_blood_count = $8, \
            urea_electrolytes = $9, liver_function = $10, thyroid_function = $11, hba1c \
            = $12, lipid_profile = $13, c_reactive_protein = $14, coagulation_screen = \
            $15, bone_profile = $16, ferritin_iron = $17, vitamin_b12_folate = $18, \
            vitamin_d = $19, hba1c_monitoring = $20, glucose = $21, inr = $22, \
            blood_culture = $23, group_and_save = $24, crossmatch = $25, troponin = $26, \
            d_dimer = $27, amylase_lipase = $28, primary_indication = $29, \
            clinical_details = $30, relevant_medications = $31, fasting_required = $32, \
            fasting_status = $33, specimen_collected = $34, collection_datetime = $35, \
            known_blood_borne_virus = $36, difficult_venous_access = $37, urgency = $38, \
            supervising_consultant = $39, requester_contact = $40, notes = $41, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.full_blood_count)
        .bind(self.urea_electrolytes)
        .bind(self.liver_function)
        .bind(self.thyroid_function)
        .bind(self.hba1c)
        .bind(self.lipid_profile)
        .bind(self.c_reactive_protein)
        .bind(self.coagulation_screen)
        .bind(self.bone_profile)
        .bind(self.ferritin_iron)
        .bind(self.vitamin_b12_folate)
        .bind(self.vitamin_d)
        .bind(self.hba1c_monitoring)
        .bind(self.glucose)
        .bind(self.inr)
        .bind(self.blood_culture)
        .bind(self.group_and_save)
        .bind(self.crossmatch)
        .bind(self.troponin)
        .bind(self.d_dimer)
        .bind(self.amylase_lipase)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(&self.relevant_medications)
        .bind(self.fasting_required)
        .bind(&self.fasting_status)
        .bind(&self.specimen_collected)
        .bind(self.collection_datetime)
        .bind(self.known_blood_borne_virus)
        .bind(self.difficult_venous_access)
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
        .prefix("api/blood_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
