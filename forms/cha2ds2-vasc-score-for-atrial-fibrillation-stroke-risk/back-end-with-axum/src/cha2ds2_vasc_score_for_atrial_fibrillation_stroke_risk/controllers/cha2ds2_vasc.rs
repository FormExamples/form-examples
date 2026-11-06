#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::cha2ds2_vascs::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub atrial_fibrillation_type: String,
    pub patient_identifier: String,
    pub age_years: Option<i32>,
    pub sex: String,
    pub congestive_heart_failure: String,
    pub hypertension: String,
    pub diabetes: String,
    pub stroke_tia_thromboembolism: String,
    pub vascular_disease: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO cha2ds2_vascs (patient_id, clinician_id, clinician_name, \
            clinician_role, assessed_at, care_setting, atrial_fibrillation_type, \
            patient_identifier, age_years, sex, congestive_heart_failure, hypertension, \
            diabetes, stroke_tia_thromboembolism, vascular_disease, clinical_note) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING \
            *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.atrial_fibrillation_type)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.congestive_heart_failure)
        .bind(&self.hypertension)
        .bind(&self.diabetes)
        .bind(&self.stroke_tia_thromboembolism)
        .bind(&self.vascular_disease)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE cha2ds2_vascs SET patient_id = $2, clinician_id = $3, clinician_name = $4, \
            clinician_role = $5, assessed_at = $6, care_setting = $7, \
            atrial_fibrillation_type = $8, patient_identifier = $9, age_years = $10, sex = \
            $11, congestive_heart_failure = $12, hypertension = $13, diabetes = $14, \
            stroke_tia_thromboembolism = $15, vascular_disease = $16, clinical_note = $17, \
            updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.atrial_fibrillation_type)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.congestive_heart_failure)
        .bind(&self.hypertension)
        .bind(&self.diabetes)
        .bind(&self.stroke_tia_thromboembolism)
        .bind(&self.vascular_disease)
        .bind(&self.clinical_note)
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
        .prefix("api/cha2ds2_vascs/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
