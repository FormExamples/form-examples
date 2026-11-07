#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::newborn_and_infant_physical_examinations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub practitioner_name: String,
    pub practitioner_role: String,
    pub examined_at: Option<DateTimeWithTimeZone>,
    pub examination_context: String,
    pub care_setting: String,
    pub baby_identifier: String,
    pub baby_name: String,
    pub date_of_birth: Option<Date>,
    pub sex: String,
    pub gestational_age_weeks: Option<f64>,
    pub birth_weight_grams: Option<f64>,
    pub breech_presentation: String,
    pub family_history_hip_problems: String,
    pub antenatal_concerns: String,
    pub eyes_red_reflex_right: String,
    pub eyes_red_reflex_left: String,
    pub eyes_appearance: String,
    pub heart_murmur: String,
    pub femoral_pulses_right: String,
    pub femoral_pulses_left: String,
    pub central_cyanosis: String,
    pub oxygen_saturation_preductal: Option<f64>,
    pub oxygen_saturation_postductal: Option<f64>,
    pub barlow_test: String,
    pub ortolani_test: String,
    pub hip_abduction: String,
    pub testis_right: String,
    pub testis_left: String,
    pub general_appearance: String,
    pub skin: String,
    pub head_and_fontanelles: String,
    pub face_and_palate: String,
    pub neck_and_clavicles: String,
    pub chest_and_lungs: String,
    pub abdomen: String,
    pub genitalia: String,
    pub anus_and_spine: String,
    pub limbs_and_digits: String,
    pub feet: String,
    pub tone_and_movement: String,
    pub weight_grams: Option<f64>,
    pub head_circumference_cm: Option<f64>,
    pub length_cm: Option<f64>,
    pub eyes_result_recorded: String,
    pub heart_result_recorded: String,
    pub hips_result_recorded: String,
    pub testes_result_recorded: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO newborn_and_infant_physical_examinations (patient_id, clinician_id, \
            practitioner_name, practitioner_role, examined_at, examination_context, \
            care_setting, baby_identifier, baby_name, date_of_birth, sex, \
            gestational_age_weeks, birth_weight_grams, breech_presentation, \
            family_history_hip_problems, antenatal_concerns, eyes_red_reflex_right, \
            eyes_red_reflex_left, eyes_appearance, heart_murmur, femoral_pulses_right, \
            femoral_pulses_left, central_cyanosis, oxygen_saturation_preductal, \
            oxygen_saturation_postductal, barlow_test, ortolani_test, hip_abduction, \
            testis_right, testis_left, general_appearance, skin, head_and_fontanelles, \
            face_and_palate, neck_and_clavicles, chest_and_lungs, abdomen, genitalia, \
            anus_and_spine, limbs_and_digits, feet, tone_and_movement, weight_grams, \
            head_circumference_cm, length_cm, eyes_result_recorded, heart_result_recorded, \
            hips_result_recorded, testes_result_recorded, clinical_note) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, \
            $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.practitioner_name)
        .bind(&self.practitioner_role)
        .bind(self.examined_at)
        .bind(&self.examination_context)
        .bind(&self.care_setting)
        .bind(&self.baby_identifier)
        .bind(&self.baby_name)
        .bind(self.date_of_birth)
        .bind(&self.sex)
        .bind(self.gestational_age_weeks)
        .bind(self.birth_weight_grams)
        .bind(&self.breech_presentation)
        .bind(&self.family_history_hip_problems)
        .bind(&self.antenatal_concerns)
        .bind(&self.eyes_red_reflex_right)
        .bind(&self.eyes_red_reflex_left)
        .bind(&self.eyes_appearance)
        .bind(&self.heart_murmur)
        .bind(&self.femoral_pulses_right)
        .bind(&self.femoral_pulses_left)
        .bind(&self.central_cyanosis)
        .bind(self.oxygen_saturation_preductal)
        .bind(self.oxygen_saturation_postductal)
        .bind(&self.barlow_test)
        .bind(&self.ortolani_test)
        .bind(&self.hip_abduction)
        .bind(&self.testis_right)
        .bind(&self.testis_left)
        .bind(&self.general_appearance)
        .bind(&self.skin)
        .bind(&self.head_and_fontanelles)
        .bind(&self.face_and_palate)
        .bind(&self.neck_and_clavicles)
        .bind(&self.chest_and_lungs)
        .bind(&self.abdomen)
        .bind(&self.genitalia)
        .bind(&self.anus_and_spine)
        .bind(&self.limbs_and_digits)
        .bind(&self.feet)
        .bind(&self.tone_and_movement)
        .bind(self.weight_grams)
        .bind(self.head_circumference_cm)
        .bind(self.length_cm)
        .bind(&self.eyes_result_recorded)
        .bind(&self.heart_result_recorded)
        .bind(&self.hips_result_recorded)
        .bind(&self.testes_result_recorded)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE newborn_and_infant_physical_examinations SET patient_id = $2, \
            clinician_id = $3, practitioner_name = $4, practitioner_role = $5, \
            examined_at = $6, examination_context = $7, care_setting = $8, \
            baby_identifier = $9, baby_name = $10, date_of_birth = $11, sex = $12, \
            gestational_age_weeks = $13, birth_weight_grams = $14, breech_presentation = \
            $15, family_history_hip_problems = $16, antenatal_concerns = $17, \
            eyes_red_reflex_right = $18, eyes_red_reflex_left = $19, eyes_appearance = \
            $20, heart_murmur = $21, femoral_pulses_right = $22, femoral_pulses_left = \
            $23, central_cyanosis = $24, oxygen_saturation_preductal = $25, \
            oxygen_saturation_postductal = $26, barlow_test = $27, ortolani_test = $28, \
            hip_abduction = $29, testis_right = $30, testis_left = $31, \
            general_appearance = $32, skin = $33, head_and_fontanelles = $34, \
            face_and_palate = $35, neck_and_clavicles = $36, chest_and_lungs = $37, \
            abdomen = $38, genitalia = $39, anus_and_spine = $40, limbs_and_digits = \
            $41, feet = $42, tone_and_movement = $43, weight_grams = $44, \
            head_circumference_cm = $45, length_cm = $46, eyes_result_recorded = $47, \
            heart_result_recorded = $48, hips_result_recorded = $49, \
            testes_result_recorded = $50, clinical_note = $51, updated_at = now() WHERE \
            id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.practitioner_name)
        .bind(&self.practitioner_role)
        .bind(self.examined_at)
        .bind(&self.examination_context)
        .bind(&self.care_setting)
        .bind(&self.baby_identifier)
        .bind(&self.baby_name)
        .bind(self.date_of_birth)
        .bind(&self.sex)
        .bind(self.gestational_age_weeks)
        .bind(self.birth_weight_grams)
        .bind(&self.breech_presentation)
        .bind(&self.family_history_hip_problems)
        .bind(&self.antenatal_concerns)
        .bind(&self.eyes_red_reflex_right)
        .bind(&self.eyes_red_reflex_left)
        .bind(&self.eyes_appearance)
        .bind(&self.heart_murmur)
        .bind(&self.femoral_pulses_right)
        .bind(&self.femoral_pulses_left)
        .bind(&self.central_cyanosis)
        .bind(self.oxygen_saturation_preductal)
        .bind(self.oxygen_saturation_postductal)
        .bind(&self.barlow_test)
        .bind(&self.ortolani_test)
        .bind(&self.hip_abduction)
        .bind(&self.testis_right)
        .bind(&self.testis_left)
        .bind(&self.general_appearance)
        .bind(&self.skin)
        .bind(&self.head_and_fontanelles)
        .bind(&self.face_and_palate)
        .bind(&self.neck_and_clavicles)
        .bind(&self.chest_and_lungs)
        .bind(&self.abdomen)
        .bind(&self.genitalia)
        .bind(&self.anus_and_spine)
        .bind(&self.limbs_and_digits)
        .bind(&self.feet)
        .bind(&self.tone_and_movement)
        .bind(self.weight_grams)
        .bind(self.head_circumference_cm)
        .bind(self.length_cm)
        .bind(&self.eyes_result_recorded)
        .bind(&self.heart_result_recorded)
        .bind(&self.hips_result_recorded)
        .bind(&self.testes_result_recorded)
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
        .prefix("api/newborn_and_infant_physical_examinations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
