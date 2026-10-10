//! Supplier module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::suppliers::{ActiveModel, Entity, Model};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Deleted at.
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Name.
    pub name: String,
    /// Trading name.
    pub trading_name: String,
    /// Company registration number.
    pub company_registration_number: String,
    /// Country of registration as iso 3166 1 alpha 2.
    pub country_of_registration_as_iso_3166_1_alpha_2: Option<String>,
    /// Ico registration number.
    pub ico_registration_number: String,
    /// Website.
    pub website: String,
    /// Postal address as full text.
    pub postal_address_as_full_text: Option<String>,
    /// Postcode.
    pub postcode: Option<String>,
    /// Contact name.
    pub contact_name: String,
    /// Contact email.
    pub contact_email: Option<String>,
    /// Contact phone.
    pub contact_phone: Option<String>,
}

impl Params {
    fn update(&self, item: &mut ActiveModel) {
        item.deleted_at = Set(self.deleted_at);
        item.name = Set(self.name.clone());
        item.trading_name = Set(self.trading_name.clone());
        item.company_registration_number = Set(self.company_registration_number.clone());
        item.country_of_registration_as_iso_3166_1_alpha_2 =
            Set(self.country_of_registration_as_iso_3166_1_alpha_2.clone());
        item.ico_registration_number = Set(self.ico_registration_number.clone());
        item.website = Set(self.website.clone());
        item.postal_address_as_full_text = Set(self.postal_address_as_full_text.clone());
        item.postcode = Set(self.postcode.clone());
        item.contact_name = Set(self.contact_name.clone());
        item.contact_email = Set(self.contact_email.clone());
        item.contact_phone = Set(self.contact_phone.clone());
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    format::json(Entity::find().all(&ctx.db).await?)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let item = item.update(&ctx.db).await?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/suppliers/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
