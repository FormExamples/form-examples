use loco_rs::prelude::*;

use crate::models::_entities::medical_operation_note_procedures;

/// Render a list view of `medical_operation_note_procedures`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<medical_operation_note_procedures::Model>) -> Result<Response> {
    format::render().view(v, "medical_operation_note_procedure/list.html", data!({"items": items}))
}

/// Render a single `medical_operation_note_procedure` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &medical_operation_note_procedures::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_procedure/show.html", data!({"item": item}))
}

/// Render a `medical_operation_note_procedure` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "medical_operation_note_procedure/create.html", data!({}))
}

/// Render a `medical_operation_note_procedure` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &medical_operation_note_procedures::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_procedure/edit.html", data!({"item": item}))
}
