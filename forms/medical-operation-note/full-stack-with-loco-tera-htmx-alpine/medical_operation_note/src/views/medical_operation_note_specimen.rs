use loco_rs::prelude::*;

use crate::models::_entities::medical_operation_note_specimens;

/// Render a list view of `medical_operation_note_specimens`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<medical_operation_note_specimens::Model>) -> Result<Response> {
    format::render().view(v, "medical_operation_note_specimen/list.html", data!({"items": items}))
}

/// Render a single `medical_operation_note_specimen` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &medical_operation_note_specimens::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_specimen/show.html", data!({"item": item}))
}

/// Render a `medical_operation_note_specimen` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "medical_operation_note_specimen/create.html", data!({}))
}

/// Render a `medical_operation_note_specimen` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &medical_operation_note_specimens::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_specimen/edit.html", data!({"item": item}))
}
