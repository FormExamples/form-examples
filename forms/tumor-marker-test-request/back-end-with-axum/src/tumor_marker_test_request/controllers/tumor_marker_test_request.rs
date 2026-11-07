#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::tumor_marker_test_requests::Model;

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
    pub psa: bool,
    pub ca125: bool,
    pub ca19_9: bool,
    pub carcinoembryonic_antigen_cea: bool,
    pub alpha_fetoprotein_afp: bool,
    pub beta_hcg: bool,
    pub ca15_3: bool,
    pub lactate_dehydrogenase_ldh: bool,
    pub calcitonin: bool,
    pub chromogranin_a: bool,
    pub primary_indication: String,
    pub clinical_details: String,
    pub known_cancer_site: String,
    pub on_treatment: bool,
    pub previous_marker_value: Option<f64>,
    pub previous_marker_date: Option<Date>,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO tumor_marker_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, psa, ca125, ca19_9, \
            carcinoembryonic_antigen_cea, alpha_fetoprotein_afp, beta_hcg, ca15_3, \
            lactate_dehydrogenase_ldh, calcitonin, chromogranin_a, primary_indication, \
            clinical_details, known_cancer_site, on_treatment, previous_marker_value, \
            previous_marker_date, urgency, supervising_consultant, requester_contact, \
            notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, \
            $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(self.psa)
        .bind(self.ca125)
        .bind(self.ca19_9)
        .bind(self.carcinoembryonic_antigen_cea)
        .bind(self.alpha_fetoprotein_afp)
        .bind(self.beta_hcg)
        .bind(self.ca15_3)
        .bind(self.lactate_dehydrogenase_ldh)
        .bind(self.calcitonin)
        .bind(self.chromogranin_a)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(&self.known_cancer_site)
        .bind(self.on_treatment)
        .bind(self.previous_marker_value)
        .bind(self.previous_marker_date)
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
            "UPDATE tumor_marker_test_requests SET patient_id = $2, clinician_id = $3, \
            status = $4, site_name = $5, setting = $6, referral_date = $7, \
            requested_by_date = $8, psa = $9, ca125 = $10, ca19_9 = $11, \
            carcinoembryonic_antigen_cea = $12, alpha_fetoprotein_afp = $13, beta_hcg = \
            $14, ca15_3 = $15, lactate_dehydrogenase_ldh = $16, calcitonin = $17, \
            chromogranin_a = $18, primary_indication = $19, clinical_details = $20, \
            known_cancer_site = $21, on_treatment = $22, previous_marker_value = $23, \
            previous_marker_date = $24, urgency = $25, supervising_consultant = $26, \
            requester_contact = $27, notes = $28, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(self.psa)
        .bind(self.ca125)
        .bind(self.ca19_9)
        .bind(self.carcinoembryonic_antigen_cea)
        .bind(self.alpha_fetoprotein_afp)
        .bind(self.beta_hcg)
        .bind(self.ca15_3)
        .bind(self.lactate_dehydrogenase_ldh)
        .bind(self.calcitonin)
        .bind(self.chromogranin_a)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(&self.known_cancer_site)
        .bind(self.on_treatment)
        .bind(self.previous_marker_value)
        .bind(self.previous_marker_date)
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
        .prefix("api/tumor_marker_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
