use loco_rs::prelude::*;

use crate::models::_entities::medical_operation_note_grade_flags;

/// Render a list view of `medical_operation_note_grade_flags`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<medical_operation_note_grade_flags::Model>) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade_flag/list.html", data!({"items": items}))
}

/// Render a single `medical_operation_note_grade_flag` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &medical_operation_note_grade_flags::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade_flag/show.html", data!({"item": item}))
}

/// Render a `medical_operation_note_grade_flag` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade_flag/create.html", data!({}))
}

/// Render a `medical_operation_note_grade_flag` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &medical_operation_note_grade_flags::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade_flag/edit.html", data!({"item": item}))
}
