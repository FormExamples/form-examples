use loco_rs::prelude::*;

use crate::models::_entities::medical_operation_note_grades;

/// Render a list view of `medical_operation_note_grades`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<medical_operation_note_grades::Model>) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade/list.html", data!({"items": items}))
}

/// Render a single `medical_operation_note_grade` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &medical_operation_note_grades::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade/show.html", data!({"item": item}))
}

/// Render a `medical_operation_note_grade` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade/create.html", data!({}))
}

/// Render a `medical_operation_note_grade` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &medical_operation_note_grades::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade/edit.html", data!({"item": item}))
}
