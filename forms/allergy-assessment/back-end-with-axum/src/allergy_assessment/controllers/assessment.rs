#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub status: String,
    pub age_of_onset: Option<i32>,
    pub known_allergens: String,
    pub family_history_of_atopy: String,
    pub family_atopy_details: String,
    pub family_history_of_allergy: String,
    pub family_allergy_details: String,
    pub pollen_allergy: String,
    pub dust_mite_allergy: String,
    pub mould_allergy: String,
    pub animal_dander_allergy: String,
    pub latex_allergy: String,
    pub insect_sting_allergy: String,
    pub insect_sting_severity: String,
    pub seasonal_pattern: String,
    pub other_environmental_allergens: String,
    pub asthma: String,
    pub asthma_severity: String,
    pub eczema: String,
    pub eczema_severity: String,
    pub rhinitis: String,
    pub rhinitis_severity: String,
    pub eosinophilic_oesophagitis: String,
    pub mast_cell_disorders: String,
    pub mast_cell_details: String,
    pub mental_health_impact: String,
    pub mental_health_details: String,
    pub quality_of_life_score: Option<i32>,
    pub school_work_impact: String,
    pub school_work_impact_details: String,
    pub emergency_action_plan_status: String,
    pub training_provided: String,
    pub training_details: String,
    pub follow_up_schedule: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessments (patient_id, status, age_of_onset, known_allergens, \
            family_history_of_atopy, family_atopy_details, family_history_of_allergy, \
            family_allergy_details, pollen_allergy, dust_mite_allergy, mould_allergy, \
            animal_dander_allergy, latex_allergy, insect_sting_allergy, \
            insect_sting_severity, seasonal_pattern, other_environmental_allergens, \
            asthma, asthma_severity, eczema, eczema_severity, rhinitis, \
            rhinitis_severity, eosinophilic_oesophagitis, mast_cell_disorders, \
            mast_cell_details, mental_health_impact, mental_health_details, \
            quality_of_life_score, school_work_impact, school_work_impact_details, \
            emergency_action_plan_status, training_provided, training_details, \
            follow_up_schedule) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, \
            $27, $28, $29, $30, $31, $32, $33, $34, $35) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(&self.status)
        .bind(self.age_of_onset)
        .bind(&self.known_allergens)
        .bind(&self.family_history_of_atopy)
        .bind(&self.family_atopy_details)
        .bind(&self.family_history_of_allergy)
        .bind(&self.family_allergy_details)
        .bind(&self.pollen_allergy)
        .bind(&self.dust_mite_allergy)
        .bind(&self.mould_allergy)
        .bind(&self.animal_dander_allergy)
        .bind(&self.latex_allergy)
        .bind(&self.insect_sting_allergy)
        .bind(&self.insect_sting_severity)
        .bind(&self.seasonal_pattern)
        .bind(&self.other_environmental_allergens)
        .bind(&self.asthma)
        .bind(&self.asthma_severity)
        .bind(&self.eczema)
        .bind(&self.eczema_severity)
        .bind(&self.rhinitis)
        .bind(&self.rhinitis_severity)
        .bind(&self.eosinophilic_oesophagitis)
        .bind(&self.mast_cell_disorders)
        .bind(&self.mast_cell_details)
        .bind(&self.mental_health_impact)
        .bind(&self.mental_health_details)
        .bind(self.quality_of_life_score)
        .bind(&self.school_work_impact)
        .bind(&self.school_work_impact_details)
        .bind(&self.emergency_action_plan_status)
        .bind(&self.training_provided)
        .bind(&self.training_details)
        .bind(&self.follow_up_schedule)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessments SET patient_id = $2, status = $3, age_of_onset = $4, \
            known_allergens = $5, family_history_of_atopy = $6, family_atopy_details = \
            $7, family_history_of_allergy = $8, family_allergy_details = $9, \
            pollen_allergy = $10, dust_mite_allergy = $11, mould_allergy = $12, \
            animal_dander_allergy = $13, latex_allergy = $14, insect_sting_allergy = \
            $15, insect_sting_severity = $16, seasonal_pattern = $17, \
            other_environmental_allergens = $18, asthma = $19, asthma_severity = $20, \
            eczema = $21, eczema_severity = $22, rhinitis = $23, rhinitis_severity = \
            $24, eosinophilic_oesophagitis = $25, mast_cell_disorders = $26, \
            mast_cell_details = $27, mental_health_impact = $28, mental_health_details = \
            $29, quality_of_life_score = $30, school_work_impact = $31, \
            school_work_impact_details = $32, emergency_action_plan_status = $33, \
            training_provided = $34, training_details = $35, follow_up_schedule = $36, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(&self.status)
        .bind(self.age_of_onset)
        .bind(&self.known_allergens)
        .bind(&self.family_history_of_atopy)
        .bind(&self.family_atopy_details)
        .bind(&self.family_history_of_allergy)
        .bind(&self.family_allergy_details)
        .bind(&self.pollen_allergy)
        .bind(&self.dust_mite_allergy)
        .bind(&self.mould_allergy)
        .bind(&self.animal_dander_allergy)
        .bind(&self.latex_allergy)
        .bind(&self.insect_sting_allergy)
        .bind(&self.insect_sting_severity)
        .bind(&self.seasonal_pattern)
        .bind(&self.other_environmental_allergens)
        .bind(&self.asthma)
        .bind(&self.asthma_severity)
        .bind(&self.eczema)
        .bind(&self.eczema_severity)
        .bind(&self.rhinitis)
        .bind(&self.rhinitis_severity)
        .bind(&self.eosinophilic_oesophagitis)
        .bind(&self.mast_cell_disorders)
        .bind(&self.mast_cell_details)
        .bind(&self.mental_health_impact)
        .bind(&self.mental_health_details)
        .bind(self.quality_of_life_score)
        .bind(&self.school_work_impact)
        .bind(&self.school_work_impact_details)
        .bind(&self.emergency_action_plan_status)
        .bind(&self.training_provided)
        .bind(&self.training_details)
        .bind(&self.follow_up_schedule)
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
        .prefix("api/assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
