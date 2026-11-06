#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_conditions::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub assessment_id: Uuid,
    pub has_diabetes: String,
    pub has_atrial_fibrillation: String,
    pub has_rheumatoid_arthritis: String,
    pub has_chronic_kidney_disease: String,
    pub has_migraine: String,
    pub has_severe_mental_illness: String,
    pub has_erectile_dysfunction: String,
    pub on_atypical_antipsychotic: String,
    pub on_corticosteroids: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_conditions (deleted_at, assessment_id, has_diabetes, \
            has_atrial_fibrillation, has_rheumatoid_arthritis, has_chronic_kidney_disease, \
            has_migraine, has_severe_mental_illness, has_erectile_dysfunction, \
            on_atypical_antipsychotic, on_corticosteroids) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(&self.has_diabetes)
        .bind(&self.has_atrial_fibrillation)
        .bind(&self.has_rheumatoid_arthritis)
        .bind(&self.has_chronic_kidney_disease)
        .bind(&self.has_migraine)
        .bind(&self.has_severe_mental_illness)
        .bind(&self.has_erectile_dysfunction)
        .bind(&self.on_atypical_antipsychotic)
        .bind(&self.on_corticosteroids)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_conditions SET deleted_at = $2, assessment_id = $3, has_diabetes = \
            $4, has_atrial_fibrillation = $5, has_rheumatoid_arthritis = $6, \
            has_chronic_kidney_disease = $7, has_migraine = $8, has_severe_mental_illness = \
            $9, has_erectile_dysfunction = $10, on_atypical_antipsychotic = $11, \
            on_corticosteroids = $12, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(&self.has_diabetes)
        .bind(&self.has_atrial_fibrillation)
        .bind(&self.has_rheumatoid_arthritis)
        .bind(&self.has_chronic_kidney_disease)
        .bind(&self.has_migraine)
        .bind(&self.has_severe_mental_illness)
        .bind(&self.has_erectile_dysfunction)
        .bind(&self.on_atypical_antipsychotic)
        .bind(&self.on_corticosteroids)
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
        .prefix("api/medical_conditions/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
