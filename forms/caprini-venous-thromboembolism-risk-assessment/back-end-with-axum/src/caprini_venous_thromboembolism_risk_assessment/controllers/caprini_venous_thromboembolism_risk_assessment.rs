#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::caprini_venous_thromboembolism_risk_assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub admission_type: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub minor_surgery: String,
    pub recent_major_surgery: String,
    pub varicose_veins: String,
    pub inflammatory_bowel_disease: String,
    pub swollen_legs: String,
    pub obesity: String,
    pub acute_myocardial_infarction: String,
    pub congestive_heart_failure: String,
    pub sepsis: String,
    pub serious_lung_disease: String,
    pub abnormal_pulmonary_function: String,
    pub medical_patient_bed_rest: String,
    pub oral_contraceptive_or_hrt: String,
    pub pregnancy_or_postpartum: String,
    pub adverse_pregnancy_history: String,
    pub arthroscopic_surgery: String,
    pub major_open_surgery: String,
    pub laparoscopic_surgery: String,
    pub malignancy: String,
    pub confined_to_bed: String,
    pub immobilising_cast: String,
    pub central_venous_access: String,
    pub history_of_vte: String,
    pub family_history_of_thrombosis: String,
    pub factor_v_leiden: String,
    pub prothrombin_20210a: String,
    pub lupus_anticoagulant: String,
    pub anticardiolipin_antibodies: String,
    pub elevated_homocysteine: String,
    pub heparin_induced_thrombocytopenia: String,
    pub other_thrombophilia: String,
    pub stroke: String,
    pub elective_arthroplasty: String,
    pub hip_pelvis_leg_fracture: String,
    pub acute_spinal_cord_injury: String,
    pub multiple_trauma: String,
    pub high_bleeding_risk: String,
    pub clinical_note: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO caprini_venous_thromboembolism_risk_assessments (clinician_name, \
            clinician_role, assessed_at, care_setting, admission_type, patient_identifier, \
            age_band, sex, minor_surgery, recent_major_surgery, varicose_veins, \
            inflammatory_bowel_disease, swollen_legs, obesity, acute_myocardial_infarction, \
            congestive_heart_failure, sepsis, serious_lung_disease, \
            abnormal_pulmonary_function, medical_patient_bed_rest, oral_contraceptive_or_hrt, \
            pregnancy_or_postpartum, adverse_pregnancy_history, arthroscopic_surgery, \
            major_open_surgery, laparoscopic_surgery, malignancy, confined_to_bed, \
            immobilising_cast, central_venous_access, history_of_vte, \
            family_history_of_thrombosis, factor_v_leiden, prothrombin_20210a, \
            lupus_anticoagulant, anticardiolipin_antibodies, elevated_homocysteine, \
            heparin_induced_thrombocytopenia, other_thrombophilia, stroke, \
            elective_arthroplasty, hip_pelvis_leg_fracture, acute_spinal_cord_injury, \
            multiple_trauma, high_bleeding_risk, clinical_note, patient_id, clinician_id) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, \
            $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, \
            $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48) \
            RETURNING *",
        )
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.admission_type)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.minor_surgery)
        .bind(&self.recent_major_surgery)
        .bind(&self.varicose_veins)
        .bind(&self.inflammatory_bowel_disease)
        .bind(&self.swollen_legs)
        .bind(&self.obesity)
        .bind(&self.acute_myocardial_infarction)
        .bind(&self.congestive_heart_failure)
        .bind(&self.sepsis)
        .bind(&self.serious_lung_disease)
        .bind(&self.abnormal_pulmonary_function)
        .bind(&self.medical_patient_bed_rest)
        .bind(&self.oral_contraceptive_or_hrt)
        .bind(&self.pregnancy_or_postpartum)
        .bind(&self.adverse_pregnancy_history)
        .bind(&self.arthroscopic_surgery)
        .bind(&self.major_open_surgery)
        .bind(&self.laparoscopic_surgery)
        .bind(&self.malignancy)
        .bind(&self.confined_to_bed)
        .bind(&self.immobilising_cast)
        .bind(&self.central_venous_access)
        .bind(&self.history_of_vte)
        .bind(&self.family_history_of_thrombosis)
        .bind(&self.factor_v_leiden)
        .bind(&self.prothrombin_20210a)
        .bind(&self.lupus_anticoagulant)
        .bind(&self.anticardiolipin_antibodies)
        .bind(&self.elevated_homocysteine)
        .bind(&self.heparin_induced_thrombocytopenia)
        .bind(&self.other_thrombophilia)
        .bind(&self.stroke)
        .bind(&self.elective_arthroplasty)
        .bind(&self.hip_pelvis_leg_fracture)
        .bind(&self.acute_spinal_cord_injury)
        .bind(&self.multiple_trauma)
        .bind(&self.high_bleeding_risk)
        .bind(&self.clinical_note)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE caprini_venous_thromboembolism_risk_assessments SET clinician_name = $2, \
            clinician_role = $3, assessed_at = $4, care_setting = $5, admission_type = $6, \
            patient_identifier = $7, age_band = $8, sex = $9, minor_surgery = $10, \
            recent_major_surgery = $11, varicose_veins = $12, inflammatory_bowel_disease = \
            $13, swollen_legs = $14, obesity = $15, acute_myocardial_infarction = $16, \
            congestive_heart_failure = $17, sepsis = $18, serious_lung_disease = $19, \
            abnormal_pulmonary_function = $20, medical_patient_bed_rest = $21, \
            oral_contraceptive_or_hrt = $22, pregnancy_or_postpartum = $23, \
            adverse_pregnancy_history = $24, arthroscopic_surgery = $25, major_open_surgery = \
            $26, laparoscopic_surgery = $27, malignancy = $28, confined_to_bed = $29, \
            immobilising_cast = $30, central_venous_access = $31, history_of_vte = $32, \
            family_history_of_thrombosis = $33, factor_v_leiden = $34, prothrombin_20210a = \
            $35, lupus_anticoagulant = $36, anticardiolipin_antibodies = $37, \
            elevated_homocysteine = $38, heparin_induced_thrombocytopenia = $39, \
            other_thrombophilia = $40, stroke = $41, elective_arthroplasty = $42, \
            hip_pelvis_leg_fracture = $43, acute_spinal_cord_injury = $44, multiple_trauma = \
            $45, high_bleeding_risk = $46, clinical_note = $47, patient_id = $48, \
            clinician_id = $49, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.admission_type)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.minor_surgery)
        .bind(&self.recent_major_surgery)
        .bind(&self.varicose_veins)
        .bind(&self.inflammatory_bowel_disease)
        .bind(&self.swollen_legs)
        .bind(&self.obesity)
        .bind(&self.acute_myocardial_infarction)
        .bind(&self.congestive_heart_failure)
        .bind(&self.sepsis)
        .bind(&self.serious_lung_disease)
        .bind(&self.abnormal_pulmonary_function)
        .bind(&self.medical_patient_bed_rest)
        .bind(&self.oral_contraceptive_or_hrt)
        .bind(&self.pregnancy_or_postpartum)
        .bind(&self.adverse_pregnancy_history)
        .bind(&self.arthroscopic_surgery)
        .bind(&self.major_open_surgery)
        .bind(&self.laparoscopic_surgery)
        .bind(&self.malignancy)
        .bind(&self.confined_to_bed)
        .bind(&self.immobilising_cast)
        .bind(&self.central_venous_access)
        .bind(&self.history_of_vte)
        .bind(&self.family_history_of_thrombosis)
        .bind(&self.factor_v_leiden)
        .bind(&self.prothrombin_20210a)
        .bind(&self.lupus_anticoagulant)
        .bind(&self.anticardiolipin_antibodies)
        .bind(&self.elevated_homocysteine)
        .bind(&self.heparin_induced_thrombocytopenia)
        .bind(&self.other_thrombophilia)
        .bind(&self.stroke)
        .bind(&self.elective_arthroplasty)
        .bind(&self.hip_pelvis_leg_fracture)
        .bind(&self.acute_spinal_cord_injury)
        .bind(&self.multiple_trauma)
        .bind(&self.high_bleeding_risk)
        .bind(&self.clinical_note)
        .bind(self.patient_id)
        .bind(self.clinician_id)
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
        .prefix("api/caprini_venous_thromboembolism_risk_assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
