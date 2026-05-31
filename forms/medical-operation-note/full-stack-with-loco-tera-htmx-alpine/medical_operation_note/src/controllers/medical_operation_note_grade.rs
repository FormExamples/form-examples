#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};
use sea_orm::{sea_query::Order, QueryOrder};

use crate::{
    models::_entities::medical_operation_note_grades::{ActiveModel, Column, Entity, Model},
    views,
};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub medical_operation_note_id: i32,
    pub computed_composite_risk: String,
    pub final_composite_risk: String,
    pub override_reason: String,
    pub worst_clavien_dindo_grade: String,
    pub asa_physical_status: String,
    pub blood_loss_band: String,
    pub counts_agreed: String,
    pub never_event_suspected: String,
    pub recommendation: String,
    pub surgeon_notes: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
    }

impl Params {
    fn update(&self, item: &mut ActiveModel) {
      item.deleted_at = Set(self.deleted_at);
      item.medical_operation_note_id = Set(self.medical_operation_note_id);
      item.computed_composite_risk = Set(self.computed_composite_risk.clone());
      item.final_composite_risk = Set(self.final_composite_risk.clone());
      item.override_reason = Set(self.override_reason.clone());
      item.worst_clavien_dindo_grade = Set(self.worst_clavien_dindo_grade.clone());
      item.asa_physical_status = Set(self.asa_physical_status.clone());
      item.blood_loss_band = Set(self.blood_loss_band.clone());
      item.counts_agreed = Set(self.counts_agreed.clone());
      item.never_event_suspected = Set(self.never_event_suspected.clone());
      item.recommendation = Set(self.recommendation.clone());
      item.surgeon_notes = Set(self.surgeon_notes.clone());
      item.signed_at = Set(self.signed_at);
      item.graded_at = Set(self.graded_at);
      }
}

async fn load_item(ctx: &AppContext, id: i32) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    ViewEngine(v): ViewEngine<TeraView>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = Entity::find()
        .order_by(Column::Id, Order::Desc)
        .all(&ctx.db)
        .await?;
    views::medical_operation_note_grade::list(&v, &item)
}

#[debug_handler]
pub async fn new(
    ViewEngine(v): ViewEngine<TeraView>,
    State(_ctx): State<AppContext>,
) -> Result<Response> {
    views::medical_operation_note_grade::create(&v)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let _ = item.update(&ctx.db).await?;
    format::render().redirect_with_header_key("HX-Redirect", "/medical_operation_note_grades")
}

#[debug_handler]
pub async fn edit(
    Path(id): Path<i32>,
    ViewEngine(v): ViewEngine<TeraView>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    views::medical_operation_note_grade::edit(&v, &item)
}

#[debug_handler]
pub async fn show(
    Path(id): Path<i32>,
    ViewEngine(v): ViewEngine<TeraView>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    views::medical_operation_note_grade::show(&v, &item)
}

#[debug_handler]
pub async fn add(
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let _ = item.insert(&ctx.db).await?;
    format::render().redirect_with_header_key("HX-Redirect", "/medical_operation_note_grades")
}

#[debug_handler]
pub async fn remove(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("medical_operation_note_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("new", get(new))
        .add("{id}", get(show))
        .add("{id}/edit", get(edit))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
