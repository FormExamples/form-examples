use loco_rs::prelude::*;

use crate::models::_entities::patients;

/// Render a list view of `patients`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<patients::Model>) -> Result<Response> {
    format::render().view(v, "patient/list.html", data!({"items": items}))
}

/// Render a single `patient` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &patients::Model) -> Result<Response> {
    format::render().view(v, "patient/show.html", data!({"item": item}))
}

/// Render a `patient` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "patient/create.html", data!({}))
}

/// Render a `patient` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &patients::Model) -> Result<Response> {
    format::render().view(v, "patient/edit.html", data!({"item": item}))
}
