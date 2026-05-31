use loco_rs::prelude::*;

use crate::models::_entities::medical_operation_note_steps;

/// Render a list view of `medical_operation_note_steps`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<medical_operation_note_steps::Model>) -> Result<Response> {
    format::render().view(v, "medical_operation_note_step/list.html", data!({"items": items}))
}

/// Render a single `medical_operation_note_step` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &medical_operation_note_steps::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_step/show.html", data!({"item": item}))
}

/// Render a `medical_operation_note_step` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "medical_operation_note_step/create.html", data!({}))
}

/// Render a `medical_operation_note_step` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &medical_operation_note_steps::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_step/edit.html", data!({"item": item}))
}
