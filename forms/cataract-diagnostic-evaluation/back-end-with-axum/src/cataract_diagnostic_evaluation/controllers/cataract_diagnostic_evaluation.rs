#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::cataract_diagnostic_evaluations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub blurred_vision: String,
    pub glare_or_halos: String,
    pub night_driving_difficulty: String,
    pub faded_colour_perception: String,
    pub frequent_prescription_changes: String,
    pub symptom_duration_months: Option<f64>,
    pub symptom_laterality: String,
    pub presenting_complaint_notes: String,
    pub history_diabetes: String,
    pub history_prior_eye_surgery: String,
    pub history_prior_eye_surgery_detail: String,
    pub history_ocular_trauma: String,
    pub history_uveitis: String,
    pub history_steroid_use: String,
    pub history_family_cataract: String,
    pub history_smoking_status: String,
    pub history_high_uv_exposure: String,
    pub history_high_myopia: String,
    pub medical_history_notes: String,
    pub unaided_va_logmar_right: Option<f64>,
    pub unaided_va_logmar_left: Option<f64>,
    pub unaided_va_snellen_right: String,
    pub unaided_va_snellen_left: String,
    pub best_corrected_va_logmar_right: Option<f64>,
    pub best_corrected_va_logmar_left: Option<f64>,
    pub best_corrected_va_snellen_right: String,
    pub best_corrected_va_snellen_left: String,
    pub pinhole_va_logmar_right: Option<f64>,
    pub pinhole_va_logmar_left: Option<f64>,
    pub pinhole_va_snellen_right: String,
    pub pinhole_va_snellen_left: String,
    pub refraction_sphere_right: Option<f64>,
    pub refraction_sphere_left: Option<f64>,
    pub refraction_cylinder_right: Option<f64>,
    pub refraction_cylinder_left: Option<f64>,
    pub refraction_axis_right: Option<i32>,
    pub refraction_axis_left: Option<i32>,
    pub refraction_stability: String,
    pub locs_iii_no_right: Option<f64>,
    pub locs_iii_no_left: Option<f64>,
    pub locs_iii_nc_right: Option<f64>,
    pub locs_iii_nc_left: Option<f64>,
    pub locs_iii_c_right: Option<f64>,
    pub locs_iii_c_left: Option<f64>,
    pub locs_iii_p_right: Option<f64>,
    pub locs_iii_p_left: Option<f64>,
    pub cataract_type_right: String,
    pub cataract_type_left: String,
    pub anterior_chamber_depth_right: String,
    pub anterior_chamber_depth_left: String,
    pub corneal_clarity_right: String,
    pub corneal_clarity_left: String,
    pub pupil_reaction_right: String,
    pub pupil_reaction_left: String,
    pub glare_acuity_result_right: String,
    pub glare_acuity_result_left: String,
    pub glare_functional_impact: String,
    pub intraocular_pressure_right_mmhg: Option<f64>,
    pub intraocular_pressure_left_mmhg: Option<f64>,
    pub tonometry_method: String,
    pub dilated_fundus_exam_performed: String,
    pub optic_disc_cup_disc_ratio_right: Option<f64>,
    pub optic_disc_cup_disc_ratio_left: Option<f64>,
    pub macula_findings_right: String,
    pub macula_findings_left: String,
    pub retinal_findings_right: String,
    pub retinal_findings_left: String,
    pub view_obscured_by_cataract_right: String,
    pub view_obscured_by_cataract_left: String,
    pub glaucoma_suspected: String,
    pub glaucoma_notes: String,
    pub amd_suspected: String,
    pub amd_notes: String,
    pub diabetic_retinopathy_suspected: String,
    pub diabetic_retinopathy_notes: String,
    pub biometry_performed: String,
    pub axial_length_right_mm: Option<f64>,
    pub axial_length_left_mm: Option<f64>,
    pub keratometry_k1_right: Option<f64>,
    pub keratometry_k1_left: Option<f64>,
    pub keratometry_k2_right: Option<f64>,
    pub keratometry_k2_left: Option<f64>,
    pub oct_performed: String,
    pub oct_findings: String,
    pub calculated_iol_power_right: Option<f64>,
    pub calculated_iol_power_left: Option<f64>,
    pub functional_difficulty_reading: Option<i32>,
    pub functional_difficulty_driving: Option<i32>,
    pub functional_difficulty_daily_activities: Option<i32>,
    pub functional_impact_notes: String,
    pub management_recommendation: String,
    pub eye_for_surgery: String,
    pub risks_benefits_counselled: String,
    pub consent_discussed: String,
    pub management_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO cataract_diagnostic_evaluations (patient_id, clinician_id, \
            status, assessment_date, assessment_time, blurred_vision, glare_or_halos, \
            night_driving_difficulty, faded_colour_perception, \
            frequent_prescription_changes, symptom_duration_months, symptom_laterality, \
            presenting_complaint_notes, history_diabetes, history_prior_eye_surgery, \
            history_prior_eye_surgery_detail, history_ocular_trauma, history_uveitis, \
            history_steroid_use, history_family_cataract, history_smoking_status, \
            history_high_uv_exposure, history_high_myopia, medical_history_notes, \
            unaided_va_logmar_right, unaided_va_logmar_left, unaided_va_snellen_right, \
            unaided_va_snellen_left, best_corrected_va_logmar_right, \
            best_corrected_va_logmar_left, best_corrected_va_snellen_right, \
            best_corrected_va_snellen_left, pinhole_va_logmar_right, \
            pinhole_va_logmar_left, pinhole_va_snellen_right, pinhole_va_snellen_left, \
            refraction_sphere_right, refraction_sphere_left, refraction_cylinder_right, \
            refraction_cylinder_left, refraction_axis_right, refraction_axis_left, \
            refraction_stability, locs_iii_no_right, locs_iii_no_left, \
            locs_iii_nc_right, locs_iii_nc_left, locs_iii_c_right, locs_iii_c_left, \
            locs_iii_p_right, locs_iii_p_left, cataract_type_right, cataract_type_left, \
            anterior_chamber_depth_right, anterior_chamber_depth_left, \
            corneal_clarity_right, corneal_clarity_left, pupil_reaction_right, \
            pupil_reaction_left, glare_acuity_result_right, glare_acuity_result_left, \
            glare_functional_impact, intraocular_pressure_right_mmhg, \
            intraocular_pressure_left_mmhg, tonometry_method, \
            dilated_fundus_exam_performed, optic_disc_cup_disc_ratio_right, \
            optic_disc_cup_disc_ratio_left, macula_findings_right, macula_findings_left, \
            retinal_findings_right, retinal_findings_left, \
            view_obscured_by_cataract_right, view_obscured_by_cataract_left, \
            glaucoma_suspected, glaucoma_notes, amd_suspected, amd_notes, \
            diabetic_retinopathy_suspected, diabetic_retinopathy_notes, \
            biometry_performed, axial_length_right_mm, axial_length_left_mm, \
            keratometry_k1_right, keratometry_k1_left, keratometry_k2_right, \
            keratometry_k2_left, oct_performed, oct_findings, \
            calculated_iol_power_right, calculated_iol_power_left, \
            functional_difficulty_reading, functional_difficulty_driving, \
            functional_difficulty_daily_activities, functional_impact_notes, \
            management_recommendation, eye_for_surgery, risks_benefits_counselled, \
            consent_discussed, management_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, \
            $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, \
            $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, \
            $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, \
            $84, $85, $86, $87, $88, $89, $90, $91, $92, $93, $94, $95, $96, $97, $98, \
            $99, $100) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.blurred_vision)
        .bind(&self.glare_or_halos)
        .bind(&self.night_driving_difficulty)
        .bind(&self.faded_colour_perception)
        .bind(&self.frequent_prescription_changes)
        .bind(self.symptom_duration_months)
        .bind(&self.symptom_laterality)
        .bind(&self.presenting_complaint_notes)
        .bind(&self.history_diabetes)
        .bind(&self.history_prior_eye_surgery)
        .bind(&self.history_prior_eye_surgery_detail)
        .bind(&self.history_ocular_trauma)
        .bind(&self.history_uveitis)
        .bind(&self.history_steroid_use)
        .bind(&self.history_family_cataract)
        .bind(&self.history_smoking_status)
        .bind(&self.history_high_uv_exposure)
        .bind(&self.history_high_myopia)
        .bind(&self.medical_history_notes)
        .bind(self.unaided_va_logmar_right)
        .bind(self.unaided_va_logmar_left)
        .bind(&self.unaided_va_snellen_right)
        .bind(&self.unaided_va_snellen_left)
        .bind(self.best_corrected_va_logmar_right)
        .bind(self.best_corrected_va_logmar_left)
        .bind(&self.best_corrected_va_snellen_right)
        .bind(&self.best_corrected_va_snellen_left)
        .bind(self.pinhole_va_logmar_right)
        .bind(self.pinhole_va_logmar_left)
        .bind(&self.pinhole_va_snellen_right)
        .bind(&self.pinhole_va_snellen_left)
        .bind(self.refraction_sphere_right)
        .bind(self.refraction_sphere_left)
        .bind(self.refraction_cylinder_right)
        .bind(self.refraction_cylinder_left)
        .bind(self.refraction_axis_right)
        .bind(self.refraction_axis_left)
        .bind(&self.refraction_stability)
        .bind(self.locs_iii_no_right)
        .bind(self.locs_iii_no_left)
        .bind(self.locs_iii_nc_right)
        .bind(self.locs_iii_nc_left)
        .bind(self.locs_iii_c_right)
        .bind(self.locs_iii_c_left)
        .bind(self.locs_iii_p_right)
        .bind(self.locs_iii_p_left)
        .bind(&self.cataract_type_right)
        .bind(&self.cataract_type_left)
        .bind(&self.anterior_chamber_depth_right)
        .bind(&self.anterior_chamber_depth_left)
        .bind(&self.corneal_clarity_right)
        .bind(&self.corneal_clarity_left)
        .bind(&self.pupil_reaction_right)
        .bind(&self.pupil_reaction_left)
        .bind(&self.glare_acuity_result_right)
        .bind(&self.glare_acuity_result_left)
        .bind(&self.glare_functional_impact)
        .bind(self.intraocular_pressure_right_mmhg)
        .bind(self.intraocular_pressure_left_mmhg)
        .bind(&self.tonometry_method)
        .bind(&self.dilated_fundus_exam_performed)
        .bind(self.optic_disc_cup_disc_ratio_right)
        .bind(self.optic_disc_cup_disc_ratio_left)
        .bind(&self.macula_findings_right)
        .bind(&self.macula_findings_left)
        .bind(&self.retinal_findings_right)
        .bind(&self.retinal_findings_left)
        .bind(&self.view_obscured_by_cataract_right)
        .bind(&self.view_obscured_by_cataract_left)
        .bind(&self.glaucoma_suspected)
        .bind(&self.glaucoma_notes)
        .bind(&self.amd_suspected)
        .bind(&self.amd_notes)
        .bind(&self.diabetic_retinopathy_suspected)
        .bind(&self.diabetic_retinopathy_notes)
        .bind(&self.biometry_performed)
        .bind(self.axial_length_right_mm)
        .bind(self.axial_length_left_mm)
        .bind(self.keratometry_k1_right)
        .bind(self.keratometry_k1_left)
        .bind(self.keratometry_k2_right)
        .bind(self.keratometry_k2_left)
        .bind(&self.oct_performed)
        .bind(&self.oct_findings)
        .bind(self.calculated_iol_power_right)
        .bind(self.calculated_iol_power_left)
        .bind(self.functional_difficulty_reading)
        .bind(self.functional_difficulty_driving)
        .bind(self.functional_difficulty_daily_activities)
        .bind(&self.functional_impact_notes)
        .bind(&self.management_recommendation)
        .bind(&self.eye_for_surgery)
        .bind(&self.risks_benefits_counselled)
        .bind(&self.consent_discussed)
        .bind(&self.management_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE cataract_diagnostic_evaluations SET patient_id = $2, clinician_id = \
            $3, status = $4, assessment_date = $5, assessment_time = $6, blurred_vision \
            = $7, glare_or_halos = $8, night_driving_difficulty = $9, \
            faded_colour_perception = $10, frequent_prescription_changes = $11, \
            symptom_duration_months = $12, symptom_laterality = $13, \
            presenting_complaint_notes = $14, history_diabetes = $15, \
            history_prior_eye_surgery = $16, history_prior_eye_surgery_detail = $17, \
            history_ocular_trauma = $18, history_uveitis = $19, history_steroid_use = \
            $20, history_family_cataract = $21, history_smoking_status = $22, \
            history_high_uv_exposure = $23, history_high_myopia = $24, \
            medical_history_notes = $25, unaided_va_logmar_right = $26, \
            unaided_va_logmar_left = $27, unaided_va_snellen_right = $28, \
            unaided_va_snellen_left = $29, best_corrected_va_logmar_right = $30, \
            best_corrected_va_logmar_left = $31, best_corrected_va_snellen_right = $32, \
            best_corrected_va_snellen_left = $33, pinhole_va_logmar_right = $34, \
            pinhole_va_logmar_left = $35, pinhole_va_snellen_right = $36, \
            pinhole_va_snellen_left = $37, refraction_sphere_right = $38, \
            refraction_sphere_left = $39, refraction_cylinder_right = $40, \
            refraction_cylinder_left = $41, refraction_axis_right = $42, \
            refraction_axis_left = $43, refraction_stability = $44, locs_iii_no_right = \
            $45, locs_iii_no_left = $46, locs_iii_nc_right = $47, locs_iii_nc_left = \
            $48, locs_iii_c_right = $49, locs_iii_c_left = $50, locs_iii_p_right = $51, \
            locs_iii_p_left = $52, cataract_type_right = $53, cataract_type_left = $54, \
            anterior_chamber_depth_right = $55, anterior_chamber_depth_left = $56, \
            corneal_clarity_right = $57, corneal_clarity_left = $58, \
            pupil_reaction_right = $59, pupil_reaction_left = $60, \
            glare_acuity_result_right = $61, glare_acuity_result_left = $62, \
            glare_functional_impact = $63, intraocular_pressure_right_mmhg = $64, \
            intraocular_pressure_left_mmhg = $65, tonometry_method = $66, \
            dilated_fundus_exam_performed = $67, optic_disc_cup_disc_ratio_right = $68, \
            optic_disc_cup_disc_ratio_left = $69, macula_findings_right = $70, \
            macula_findings_left = $71, retinal_findings_right = $72, \
            retinal_findings_left = $73, view_obscured_by_cataract_right = $74, \
            view_obscured_by_cataract_left = $75, glaucoma_suspected = $76, \
            glaucoma_notes = $77, amd_suspected = $78, amd_notes = $79, \
            diabetic_retinopathy_suspected = $80, diabetic_retinopathy_notes = $81, \
            biometry_performed = $82, axial_length_right_mm = $83, axial_length_left_mm \
            = $84, keratometry_k1_right = $85, keratometry_k1_left = $86, \
            keratometry_k2_right = $87, keratometry_k2_left = $88, oct_performed = $89, \
            oct_findings = $90, calculated_iol_power_right = $91, \
            calculated_iol_power_left = $92, functional_difficulty_reading = $93, \
            functional_difficulty_driving = $94, functional_difficulty_daily_activities \
            = $95, functional_impact_notes = $96, management_recommendation = $97, \
            eye_for_surgery = $98, risks_benefits_counselled = $99, consent_discussed = \
            $100, management_notes = $101, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.blurred_vision)
        .bind(&self.glare_or_halos)
        .bind(&self.night_driving_difficulty)
        .bind(&self.faded_colour_perception)
        .bind(&self.frequent_prescription_changes)
        .bind(self.symptom_duration_months)
        .bind(&self.symptom_laterality)
        .bind(&self.presenting_complaint_notes)
        .bind(&self.history_diabetes)
        .bind(&self.history_prior_eye_surgery)
        .bind(&self.history_prior_eye_surgery_detail)
        .bind(&self.history_ocular_trauma)
        .bind(&self.history_uveitis)
        .bind(&self.history_steroid_use)
        .bind(&self.history_family_cataract)
        .bind(&self.history_smoking_status)
        .bind(&self.history_high_uv_exposure)
        .bind(&self.history_high_myopia)
        .bind(&self.medical_history_notes)
        .bind(self.unaided_va_logmar_right)
        .bind(self.unaided_va_logmar_left)
        .bind(&self.unaided_va_snellen_right)
        .bind(&self.unaided_va_snellen_left)
        .bind(self.best_corrected_va_logmar_right)
        .bind(self.best_corrected_va_logmar_left)
        .bind(&self.best_corrected_va_snellen_right)
        .bind(&self.best_corrected_va_snellen_left)
        .bind(self.pinhole_va_logmar_right)
        .bind(self.pinhole_va_logmar_left)
        .bind(&self.pinhole_va_snellen_right)
        .bind(&self.pinhole_va_snellen_left)
        .bind(self.refraction_sphere_right)
        .bind(self.refraction_sphere_left)
        .bind(self.refraction_cylinder_right)
        .bind(self.refraction_cylinder_left)
        .bind(self.refraction_axis_right)
        .bind(self.refraction_axis_left)
        .bind(&self.refraction_stability)
        .bind(self.locs_iii_no_right)
        .bind(self.locs_iii_no_left)
        .bind(self.locs_iii_nc_right)
        .bind(self.locs_iii_nc_left)
        .bind(self.locs_iii_c_right)
        .bind(self.locs_iii_c_left)
        .bind(self.locs_iii_p_right)
        .bind(self.locs_iii_p_left)
        .bind(&self.cataract_type_right)
        .bind(&self.cataract_type_left)
        .bind(&self.anterior_chamber_depth_right)
        .bind(&self.anterior_chamber_depth_left)
        .bind(&self.corneal_clarity_right)
        .bind(&self.corneal_clarity_left)
        .bind(&self.pupil_reaction_right)
        .bind(&self.pupil_reaction_left)
        .bind(&self.glare_acuity_result_right)
        .bind(&self.glare_acuity_result_left)
        .bind(&self.glare_functional_impact)
        .bind(self.intraocular_pressure_right_mmhg)
        .bind(self.intraocular_pressure_left_mmhg)
        .bind(&self.tonometry_method)
        .bind(&self.dilated_fundus_exam_performed)
        .bind(self.optic_disc_cup_disc_ratio_right)
        .bind(self.optic_disc_cup_disc_ratio_left)
        .bind(&self.macula_findings_right)
        .bind(&self.macula_findings_left)
        .bind(&self.retinal_findings_right)
        .bind(&self.retinal_findings_left)
        .bind(&self.view_obscured_by_cataract_right)
        .bind(&self.view_obscured_by_cataract_left)
        .bind(&self.glaucoma_suspected)
        .bind(&self.glaucoma_notes)
        .bind(&self.amd_suspected)
        .bind(&self.amd_notes)
        .bind(&self.diabetic_retinopathy_suspected)
        .bind(&self.diabetic_retinopathy_notes)
        .bind(&self.biometry_performed)
        .bind(self.axial_length_right_mm)
        .bind(self.axial_length_left_mm)
        .bind(self.keratometry_k1_right)
        .bind(self.keratometry_k1_left)
        .bind(self.keratometry_k2_right)
        .bind(self.keratometry_k2_left)
        .bind(&self.oct_performed)
        .bind(&self.oct_findings)
        .bind(self.calculated_iol_power_right)
        .bind(self.calculated_iol_power_left)
        .bind(self.functional_difficulty_reading)
        .bind(self.functional_difficulty_driving)
        .bind(self.functional_difficulty_daily_activities)
        .bind(&self.functional_impact_notes)
        .bind(&self.management_recommendation)
        .bind(&self.eye_for_surgery)
        .bind(&self.risks_benefits_counselled)
        .bind(&self.consent_discussed)
        .bind(&self.management_notes)
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
        .prefix("api/cataract_diagnostic_evaluations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
