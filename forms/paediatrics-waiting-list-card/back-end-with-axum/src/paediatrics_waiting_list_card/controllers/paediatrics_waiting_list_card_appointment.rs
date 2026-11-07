#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::paediatrics_waiting_list_card_appointments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub paediatrics_waiting_list_card_id: Uuid,
    pub appointment_date: Option<Date>,
    pub appointment_time: Option<String>,
    pub duration_minutes: Option<i32>,
    pub appointment_type: String,
    pub site_name: String,
    pub site_address: String,
    pub clinic_name: String,
    pub room: String,
    pub clinician_name: String,
    pub clinician_team: String,
    pub status: String,
    pub travel_notes: String,
    pub access_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO paediatrics_waiting_list_card_appointments \
            (paediatrics_waiting_list_card_id, appointment_date, appointment_time, \
            duration_minutes, appointment_type, site_name, site_address, clinic_name, \
            room, clinician_name, clinician_team, status, travel_notes, access_notes) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) \
            RETURNING *",
        )
        .bind(self.paediatrics_waiting_list_card_id)
        .bind(self.appointment_date)
        .bind(&self.appointment_time)
        .bind(self.duration_minutes)
        .bind(&self.appointment_type)
        .bind(&self.site_name)
        .bind(&self.site_address)
        .bind(&self.clinic_name)
        .bind(&self.room)
        .bind(&self.clinician_name)
        .bind(&self.clinician_team)
        .bind(&self.status)
        .bind(&self.travel_notes)
        .bind(&self.access_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE paediatrics_waiting_list_card_appointments SET \
            paediatrics_waiting_list_card_id = $2, appointment_date = $3, \
            appointment_time = $4, duration_minutes = $5, appointment_type = $6, \
            site_name = $7, site_address = $8, clinic_name = $9, room = $10, \
            clinician_name = $11, clinician_team = $12, status = $13, travel_notes = \
            $14, access_notes = $15, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.paediatrics_waiting_list_card_id)
        .bind(self.appointment_date)
        .bind(&self.appointment_time)
        .bind(self.duration_minutes)
        .bind(&self.appointment_type)
        .bind(&self.site_name)
        .bind(&self.site_address)
        .bind(&self.clinic_name)
        .bind(&self.room)
        .bind(&self.clinician_name)
        .bind(&self.clinician_team)
        .bind(&self.status)
        .bind(&self.travel_notes)
        .bind(&self.access_notes)
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
        .prefix("api/paediatrics_waiting_list_card_appointments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
