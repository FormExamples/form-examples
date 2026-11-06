#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hernia_diagnostic_evaluations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub site_name: String,
    pub duration_of_bulge: String,
    pub pain_score_0_10: Option<i32>,
    pub pain_onset: String,
    pub aggravated_by_straining: String,
    pub aggravated_by_lifting: String,
    pub aggravated_by_coughing: String,
    pub prior_hernia_history: String,
    pub prior_hernia_repair: String,
    pub prior_hernia_repair_mesh: String,
    pub prior_hernia_repair_site: String,
    pub history_notes: String,
    pub risk_chronic_cough: String,
    pub risk_constipation_or_straining: String,
    pub risk_heavy_lifting_occupation: String,
    pub risk_obesity: String,
    pub risk_smoking: String,
    pub risk_family_history: String,
    pub risk_prior_abdominal_surgery: String,
    pub risk_pregnancy: String,
    pub risk_connective_tissue_disorder: String,
    pub risk_ascites: String,
    pub risk_factors_notes: String,
    pub inspection_location: String,
    pub inspection_location_other: String,
    pub bulge_visible_at_rest: String,
    pub bulge_enlarges_on_standing_or_straining: String,
    pub skin_changes: String,
    pub inspection_notes: String,
    pub palpable_mass: String,
    pub cough_impulse_positive: String,
    pub tenderness: String,
    pub mass_size_as_cm: Option<f64>,
    pub palpation_notes: String,
    pub reducibility_status: String,
    pub reduces_spontaneously: String,
    pub reduces_with_manual_pressure: String,
    pub does_not_reduce: String,
    pub reducibility_notes: String,
    pub red_flag_severe_pain: String,
    pub red_flag_vomiting: String,
    pub red_flag_fever: String,
    pub red_flag_absolute_constipation: String,
    pub red_flag_erythema_or_discolouration: String,
    pub red_flag_previously_reducible_now_irreducible: String,
    pub red_flag_tachycardia: String,
    pub red_flag_notes: String,
    pub hernia_type: String,
    pub hernia_type_other: String,
    pub inguinal_subtype: String,
    pub laterality: String,
    pub ehs_size_grade: String,
    pub classification_notes: String,
    pub ultrasound_performed: String,
    pub ultrasound_findings: String,
    pub ct_performed: String,
    pub ct_findings: String,
    pub mri_performed: String,
    pub mri_findings: String,
    pub imaging_indication: String,
    pub imaging_notes: String,
    pub differential_lipoma: String,
    pub differential_lymphadenopathy: String,
    pub differential_hydrocele: String,
    pub differential_undescended_testis: String,
    pub differential_femoral_aneurysm: String,
    pub differential_abscess: String,
    pub differential_other: String,
    pub differential_notes: String,
    pub pain_interferes_with_work_or_activity: String,
    pub functional_impact_scale_0_10: Option<i32>,
    pub activity_limitation: String,
    pub management_plan: String,
    pub conservative_detail: String,
    pub referral_made: String,
    pub referral_target_timeframe: String,
    pub management_notes: String,
    pub additional_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hernia_diagnostic_evaluations (deleted_at, patient_id, clinician_id, \
            status, assessment_date, assessment_time, site_name, duration_of_bulge, \
            pain_score_0_10, pain_onset, aggravated_by_straining, aggravated_by_lifting, \
            aggravated_by_coughing, prior_hernia_history, prior_hernia_repair, \
            prior_hernia_repair_mesh, prior_hernia_repair_site, history_notes, \
            risk_chronic_cough, risk_constipation_or_straining, \
            risk_heavy_lifting_occupation, risk_obesity, risk_smoking, risk_family_history, \
            risk_prior_abdominal_surgery, risk_pregnancy, risk_connective_tissue_disorder, \
            risk_ascites, risk_factors_notes, inspection_location, inspection_location_other, \
            bulge_visible_at_rest, bulge_enlarges_on_standing_or_straining, skin_changes, \
            inspection_notes, palpable_mass, cough_impulse_positive, tenderness, \
            mass_size_as_cm, palpation_notes, reducibility_status, reduces_spontaneously, \
            reduces_with_manual_pressure, does_not_reduce, reducibility_notes, \
            red_flag_severe_pain, red_flag_vomiting, red_flag_fever, \
            red_flag_absolute_constipation, red_flag_erythema_or_discolouration, \
            red_flag_previously_reducible_now_irreducible, red_flag_tachycardia, \
            red_flag_notes, hernia_type, hernia_type_other, inguinal_subtype, laterality, \
            ehs_size_grade, classification_notes, ultrasound_performed, ultrasound_findings, \
            ct_performed, ct_findings, mri_performed, mri_findings, imaging_indication, \
            imaging_notes, differential_lipoma, differential_lymphadenopathy, \
            differential_hydrocele, differential_undescended_testis, \
            differential_femoral_aneurysm, differential_abscess, differential_other, \
            differential_notes, pain_interferes_with_work_or_activity, \
            functional_impact_scale_0_10, activity_limitation, management_plan, \
            conservative_detail, referral_made, referral_target_timeframe, management_notes, \
            additional_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, \
            $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, \
            $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, \
            $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, \
            $78, $79, $80, $81, $82, $83, $84) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.site_name)
        .bind(&self.duration_of_bulge)
        .bind(self.pain_score_0_10)
        .bind(&self.pain_onset)
        .bind(&self.aggravated_by_straining)
        .bind(&self.aggravated_by_lifting)
        .bind(&self.aggravated_by_coughing)
        .bind(&self.prior_hernia_history)
        .bind(&self.prior_hernia_repair)
        .bind(&self.prior_hernia_repair_mesh)
        .bind(&self.prior_hernia_repair_site)
        .bind(&self.history_notes)
        .bind(&self.risk_chronic_cough)
        .bind(&self.risk_constipation_or_straining)
        .bind(&self.risk_heavy_lifting_occupation)
        .bind(&self.risk_obesity)
        .bind(&self.risk_smoking)
        .bind(&self.risk_family_history)
        .bind(&self.risk_prior_abdominal_surgery)
        .bind(&self.risk_pregnancy)
        .bind(&self.risk_connective_tissue_disorder)
        .bind(&self.risk_ascites)
        .bind(&self.risk_factors_notes)
        .bind(&self.inspection_location)
        .bind(&self.inspection_location_other)
        .bind(&self.bulge_visible_at_rest)
        .bind(&self.bulge_enlarges_on_standing_or_straining)
        .bind(&self.skin_changes)
        .bind(&self.inspection_notes)
        .bind(&self.palpable_mass)
        .bind(&self.cough_impulse_positive)
        .bind(&self.tenderness)
        .bind(self.mass_size_as_cm)
        .bind(&self.palpation_notes)
        .bind(&self.reducibility_status)
        .bind(&self.reduces_spontaneously)
        .bind(&self.reduces_with_manual_pressure)
        .bind(&self.does_not_reduce)
        .bind(&self.reducibility_notes)
        .bind(&self.red_flag_severe_pain)
        .bind(&self.red_flag_vomiting)
        .bind(&self.red_flag_fever)
        .bind(&self.red_flag_absolute_constipation)
        .bind(&self.red_flag_erythema_or_discolouration)
        .bind(&self.red_flag_previously_reducible_now_irreducible)
        .bind(&self.red_flag_tachycardia)
        .bind(&self.red_flag_notes)
        .bind(&self.hernia_type)
        .bind(&self.hernia_type_other)
        .bind(&self.inguinal_subtype)
        .bind(&self.laterality)
        .bind(&self.ehs_size_grade)
        .bind(&self.classification_notes)
        .bind(&self.ultrasound_performed)
        .bind(&self.ultrasound_findings)
        .bind(&self.ct_performed)
        .bind(&self.ct_findings)
        .bind(&self.mri_performed)
        .bind(&self.mri_findings)
        .bind(&self.imaging_indication)
        .bind(&self.imaging_notes)
        .bind(&self.differential_lipoma)
        .bind(&self.differential_lymphadenopathy)
        .bind(&self.differential_hydrocele)
        .bind(&self.differential_undescended_testis)
        .bind(&self.differential_femoral_aneurysm)
        .bind(&self.differential_abscess)
        .bind(&self.differential_other)
        .bind(&self.differential_notes)
        .bind(&self.pain_interferes_with_work_or_activity)
        .bind(self.functional_impact_scale_0_10)
        .bind(&self.activity_limitation)
        .bind(&self.management_plan)
        .bind(&self.conservative_detail)
        .bind(&self.referral_made)
        .bind(&self.referral_target_timeframe)
        .bind(&self.management_notes)
        .bind(&self.additional_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hernia_diagnostic_evaluations SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, status = $5, assessment_date = $6, assessment_time = $7, \
            site_name = $8, duration_of_bulge = $9, pain_score_0_10 = $10, pain_onset = $11, \
            aggravated_by_straining = $12, aggravated_by_lifting = $13, \
            aggravated_by_coughing = $14, prior_hernia_history = $15, prior_hernia_repair = \
            $16, prior_hernia_repair_mesh = $17, prior_hernia_repair_site = $18, \
            history_notes = $19, risk_chronic_cough = $20, risk_constipation_or_straining = \
            $21, risk_heavy_lifting_occupation = $22, risk_obesity = $23, risk_smoking = $24, \
            risk_family_history = $25, risk_prior_abdominal_surgery = $26, risk_pregnancy = \
            $27, risk_connective_tissue_disorder = $28, risk_ascites = $29, \
            risk_factors_notes = $30, inspection_location = $31, inspection_location_other = \
            $32, bulge_visible_at_rest = $33, bulge_enlarges_on_standing_or_straining = $34, \
            skin_changes = $35, inspection_notes = $36, palpable_mass = $37, \
            cough_impulse_positive = $38, tenderness = $39, mass_size_as_cm = $40, \
            palpation_notes = $41, reducibility_status = $42, reduces_spontaneously = $43, \
            reduces_with_manual_pressure = $44, does_not_reduce = $45, reducibility_notes = \
            $46, red_flag_severe_pain = $47, red_flag_vomiting = $48, red_flag_fever = $49, \
            red_flag_absolute_constipation = $50, red_flag_erythema_or_discolouration = $51, \
            red_flag_previously_reducible_now_irreducible = $52, red_flag_tachycardia = $53, \
            red_flag_notes = $54, hernia_type = $55, hernia_type_other = $56, \
            inguinal_subtype = $57, laterality = $58, ehs_size_grade = $59, \
            classification_notes = $60, ultrasound_performed = $61, ultrasound_findings = \
            $62, ct_performed = $63, ct_findings = $64, mri_performed = $65, mri_findings = \
            $66, imaging_indication = $67, imaging_notes = $68, differential_lipoma = $69, \
            differential_lymphadenopathy = $70, differential_hydrocele = $71, \
            differential_undescended_testis = $72, differential_femoral_aneurysm = $73, \
            differential_abscess = $74, differential_other = $75, differential_notes = $76, \
            pain_interferes_with_work_or_activity = $77, functional_impact_scale_0_10 = $78, \
            activity_limitation = $79, management_plan = $80, conservative_detail = $81, \
            referral_made = $82, referral_target_timeframe = $83, management_notes = $84, \
            additional_notes = $85, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.site_name)
        .bind(&self.duration_of_bulge)
        .bind(self.pain_score_0_10)
        .bind(&self.pain_onset)
        .bind(&self.aggravated_by_straining)
        .bind(&self.aggravated_by_lifting)
        .bind(&self.aggravated_by_coughing)
        .bind(&self.prior_hernia_history)
        .bind(&self.prior_hernia_repair)
        .bind(&self.prior_hernia_repair_mesh)
        .bind(&self.prior_hernia_repair_site)
        .bind(&self.history_notes)
        .bind(&self.risk_chronic_cough)
        .bind(&self.risk_constipation_or_straining)
        .bind(&self.risk_heavy_lifting_occupation)
        .bind(&self.risk_obesity)
        .bind(&self.risk_smoking)
        .bind(&self.risk_family_history)
        .bind(&self.risk_prior_abdominal_surgery)
        .bind(&self.risk_pregnancy)
        .bind(&self.risk_connective_tissue_disorder)
        .bind(&self.risk_ascites)
        .bind(&self.risk_factors_notes)
        .bind(&self.inspection_location)
        .bind(&self.inspection_location_other)
        .bind(&self.bulge_visible_at_rest)
        .bind(&self.bulge_enlarges_on_standing_or_straining)
        .bind(&self.skin_changes)
        .bind(&self.inspection_notes)
        .bind(&self.palpable_mass)
        .bind(&self.cough_impulse_positive)
        .bind(&self.tenderness)
        .bind(self.mass_size_as_cm)
        .bind(&self.palpation_notes)
        .bind(&self.reducibility_status)
        .bind(&self.reduces_spontaneously)
        .bind(&self.reduces_with_manual_pressure)
        .bind(&self.does_not_reduce)
        .bind(&self.reducibility_notes)
        .bind(&self.red_flag_severe_pain)
        .bind(&self.red_flag_vomiting)
        .bind(&self.red_flag_fever)
        .bind(&self.red_flag_absolute_constipation)
        .bind(&self.red_flag_erythema_or_discolouration)
        .bind(&self.red_flag_previously_reducible_now_irreducible)
        .bind(&self.red_flag_tachycardia)
        .bind(&self.red_flag_notes)
        .bind(&self.hernia_type)
        .bind(&self.hernia_type_other)
        .bind(&self.inguinal_subtype)
        .bind(&self.laterality)
        .bind(&self.ehs_size_grade)
        .bind(&self.classification_notes)
        .bind(&self.ultrasound_performed)
        .bind(&self.ultrasound_findings)
        .bind(&self.ct_performed)
        .bind(&self.ct_findings)
        .bind(&self.mri_performed)
        .bind(&self.mri_findings)
        .bind(&self.imaging_indication)
        .bind(&self.imaging_notes)
        .bind(&self.differential_lipoma)
        .bind(&self.differential_lymphadenopathy)
        .bind(&self.differential_hydrocele)
        .bind(&self.differential_undescended_testis)
        .bind(&self.differential_femoral_aneurysm)
        .bind(&self.differential_abscess)
        .bind(&self.differential_other)
        .bind(&self.differential_notes)
        .bind(&self.pain_interferes_with_work_or_activity)
        .bind(self.functional_impact_scale_0_10)
        .bind(&self.activity_limitation)
        .bind(&self.management_plan)
        .bind(&self.conservative_detail)
        .bind(&self.referral_made)
        .bind(&self.referral_target_timeframe)
        .bind(&self.management_notes)
        .bind(&self.additional_notes)
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
        .prefix("api/hernia_diagnostic_evaluations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
