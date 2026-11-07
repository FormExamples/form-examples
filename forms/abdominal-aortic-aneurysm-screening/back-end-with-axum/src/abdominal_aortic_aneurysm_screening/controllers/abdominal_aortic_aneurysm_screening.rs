#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::abdominal_aortic_aneurysm_screenings::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub technician_name: String,
    pub technician_role: String,
    pub clinic_site: String,
    pub scanned_at: Option<DateTimeWithTimeZone>,
    pub device_identifier: String,
    pub patient_identifier: String,
    pub age: Option<i32>,
    pub sex: String,
    pub eligibility_route: String,
    pub scan_type: String,
    pub consent_given: String,
    pub leaflet_provided: String,
    pub consent_note: String,
    pub aorta_visualised: String,
    pub max_aortic_diameter_cm: Option<f64>,
    pub prior_max_diameter_cm: Option<f64>,
    pub prior_scan_date: Option<Date>,
    pub symptomatic: String,
    pub incidental_findings: String,
    pub result_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO abdominal_aortic_aneurysm_screenings (patient_id, clinician_id, \
            technician_name, technician_role, clinic_site, scanned_at, device_identifier, \
            patient_identifier, age, sex, eligibility_route, scan_type, consent_given, \
            leaflet_provided, consent_note, aorta_visualised, max_aortic_diameter_cm, \
            prior_max_diameter_cm, prior_scan_date, symptomatic, incidental_findings, \
            result_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, \
            $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.technician_name)
        .bind(&self.technician_role)
        .bind(&self.clinic_site)
        .bind(self.scanned_at)
        .bind(&self.device_identifier)
        .bind(&self.patient_identifier)
        .bind(self.age)
        .bind(&self.sex)
        .bind(&self.eligibility_route)
        .bind(&self.scan_type)
        .bind(&self.consent_given)
        .bind(&self.leaflet_provided)
        .bind(&self.consent_note)
        .bind(&self.aorta_visualised)
        .bind(self.max_aortic_diameter_cm)
        .bind(self.prior_max_diameter_cm)
        .bind(self.prior_scan_date)
        .bind(&self.symptomatic)
        .bind(&self.incidental_findings)
        .bind(&self.result_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE abdominal_aortic_aneurysm_screenings SET patient_id = $2, \
            clinician_id = $3, technician_name = $4, technician_role = $5, clinic_site = \
            $6, scanned_at = $7, device_identifier = $8, patient_identifier = $9, age = \
            $10, sex = $11, eligibility_route = $12, scan_type = $13, consent_given = \
            $14, leaflet_provided = $15, consent_note = $16, aorta_visualised = $17, \
            max_aortic_diameter_cm = $18, prior_max_diameter_cm = $19, prior_scan_date = \
            $20, symptomatic = $21, incidental_findings = $22, result_note = $23, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.technician_name)
        .bind(&self.technician_role)
        .bind(&self.clinic_site)
        .bind(self.scanned_at)
        .bind(&self.device_identifier)
        .bind(&self.patient_identifier)
        .bind(self.age)
        .bind(&self.sex)
        .bind(&self.eligibility_route)
        .bind(&self.scan_type)
        .bind(&self.consent_given)
        .bind(&self.leaflet_provided)
        .bind(&self.consent_note)
        .bind(&self.aorta_visualised)
        .bind(self.max_aortic_diameter_cm)
        .bind(self.prior_max_diameter_cm)
        .bind(self.prior_scan_date)
        .bind(&self.symptomatic)
        .bind(&self.incidental_findings)
        .bind(&self.result_note)
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
        .prefix("api/abdominal_aortic_aneurysm_screenings/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
