#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_cancer_histories::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub assessment_id: Uuid,
    pub family_cancer_history: String,
    pub multiple_family_cancers: String,
    pub early_onset_cancer: String,
    pub bilateral_cancer: String,
    pub rare_tumour_types: String,
    pub rare_tumour_details: String,
    pub known_cancer_syndrome: String,
    pub cancer_syndrome_details: String,
    pub cancer_risk_score: Option<i32>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_cancer_histories (assessment_id, \
            family_cancer_history, multiple_family_cancers, early_onset_cancer, \
            bilateral_cancer, rare_tumour_types, rare_tumour_details, \
            known_cancer_syndrome, cancer_syndrome_details, cancer_risk_score) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(&self.family_cancer_history)
        .bind(&self.multiple_family_cancers)
        .bind(&self.early_onset_cancer)
        .bind(&self.bilateral_cancer)
        .bind(&self.rare_tumour_types)
        .bind(&self.rare_tumour_details)
        .bind(&self.known_cancer_syndrome)
        .bind(&self.cancer_syndrome_details)
        .bind(self.cancer_risk_score)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_cancer_histories SET assessment_id = $2, \
            family_cancer_history = $3, multiple_family_cancers = $4, early_onset_cancer \
            = $5, bilateral_cancer = $6, rare_tumour_types = $7, rare_tumour_details = \
            $8, known_cancer_syndrome = $9, cancer_syndrome_details = $10, \
            cancer_risk_score = $11, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(&self.family_cancer_history)
        .bind(&self.multiple_family_cancers)
        .bind(&self.early_onset_cancer)
        .bind(&self.bilateral_cancer)
        .bind(&self.rare_tumour_types)
        .bind(&self.rare_tumour_details)
        .bind(&self.known_cancer_syndrome)
        .bind(&self.cancer_syndrome_details)
        .bind(self.cancer_risk_score)
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
        .prefix("api/assessment_cancer_histories/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
