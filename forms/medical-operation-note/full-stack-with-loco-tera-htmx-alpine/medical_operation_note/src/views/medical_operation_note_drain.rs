use loco_rs::prelude::*;

use crate::models::_entities::medical_operation_note_drains;

/// Render a list view of `medical_operation_note_drains`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<medical_operation_note_drains::Model>) -> Result<Response> {
    format::render().view(v, "medical_operation_note_drain/list.html", data!({"items": items}))
}

/// Render a single `medical_operation_note_drain` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &medical_operation_note_drains::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_drain/show.html", data!({"item": item}))
}

/// Render a `medical_operation_note_drain` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "medical_operation_note_drain/create.html", data!({}))
}

/// Render a `medical_operation_note_drain` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &medical_operation_note_drains::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_drain/edit.html", data!({"item": item}))
}
