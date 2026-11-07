#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::mri_scan_test_requests::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub site_name: String,
    pub setting: String,
    pub referral_date: Option<Date>,
    pub requested_by_date: Option<Date>,
    pub body_region: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub contrast_required: String,
    pub egfr: Option<f64>,
    pub previous_gadolinium_reaction: String,
    pub pregnancy_status: String,
    pub pacemaker_or_icd: bool,
    pub cochlear_implant: bool,
    pub aneurysm_clip: bool,
    pub metallic_foreign_body_eye: bool,
    pub shrapnel_or_metal_fragments: bool,
    pub programmable_shunt: bool,
    pub neurostimulator: bool,
    pub metal_implant_or_prosthesis: bool,
    pub insulin_pump: bool,
    pub claustrophobia: bool,
    pub mri_safety_status: String,
    pub weight_kg: Option<f64>,
    pub relevant_previous_imaging: String,
    pub urgency: String,
    pub supervising_consultant: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO mri_scan_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, body_region, \
            primary_indication, clinical_question, relevant_history, contrast_required, \
            egfr, previous_gadolinium_reaction, pregnancy_status, pacemaker_or_icd, \
            cochlear_implant, aneurysm_clip, metallic_foreign_body_eye, \
            shrapnel_or_metal_fragments, programmable_shunt, neurostimulator, \
            metal_implant_or_prosthesis, insulin_pump, claustrophobia, \
            mri_safety_status, weight_kg, relevant_previous_imaging, urgency, \
            supervising_consultant, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, \
            $25, $26, $27, $28, $29, $30, $31) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.body_region)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(&self.contrast_required)
        .bind(self.egfr)
        .bind(&self.previous_gadolinium_reaction)
        .bind(&self.pregnancy_status)
        .bind(self.pacemaker_or_icd)
        .bind(self.cochlear_implant)
        .bind(self.aneurysm_clip)
        .bind(self.metallic_foreign_body_eye)
        .bind(self.shrapnel_or_metal_fragments)
        .bind(self.programmable_shunt)
        .bind(self.neurostimulator)
        .bind(self.metal_implant_or_prosthesis)
        .bind(self.insulin_pump)
        .bind(self.claustrophobia)
        .bind(&self.mri_safety_status)
        .bind(self.weight_kg)
        .bind(&self.relevant_previous_imaging)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE mri_scan_test_requests SET patient_id = $2, clinician_id = $3, status \
            = $4, site_name = $5, setting = $6, referral_date = $7, requested_by_date = \
            $8, body_region = $9, primary_indication = $10, clinical_question = $11, \
            relevant_history = $12, contrast_required = $13, egfr = $14, \
            previous_gadolinium_reaction = $15, pregnancy_status = $16, pacemaker_or_icd \
            = $17, cochlear_implant = $18, aneurysm_clip = $19, \
            metallic_foreign_body_eye = $20, shrapnel_or_metal_fragments = $21, \
            programmable_shunt = $22, neurostimulator = $23, metal_implant_or_prosthesis \
            = $24, insulin_pump = $25, claustrophobia = $26, mri_safety_status = $27, \
            weight_kg = $28, relevant_previous_imaging = $29, urgency = $30, \
            supervising_consultant = $31, notes = $32, updated_at = now() WHERE id = $1 \
            AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.body_region)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(&self.contrast_required)
        .bind(self.egfr)
        .bind(&self.previous_gadolinium_reaction)
        .bind(&self.pregnancy_status)
        .bind(self.pacemaker_or_icd)
        .bind(self.cochlear_implant)
        .bind(self.aneurysm_clip)
        .bind(self.metallic_foreign_body_eye)
        .bind(self.shrapnel_or_metal_fragments)
        .bind(self.programmable_shunt)
        .bind(self.neurostimulator)
        .bind(self.metal_implant_or_prosthesis)
        .bind(self.insulin_pump)
        .bind(self.claustrophobia)
        .bind(&self.mri_safety_status)
        .bind(self.weight_kg)
        .bind(&self.relevant_previous_imaging)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
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
        .prefix("api/mri_scan_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
