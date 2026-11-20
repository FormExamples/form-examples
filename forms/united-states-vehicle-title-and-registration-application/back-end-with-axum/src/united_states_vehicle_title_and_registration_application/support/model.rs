//! Errors from the model layer.

use std::collections::BTreeMap;

use axa::{error::ErrorDetail, Error};
use axum::http::StatusCode;
use serde::Serialize;
use validator::ValidationErrors;

/// A failure in the model layer.
#[derive(Debug, thiserror::Error)]
pub enum ModelError {
    /// The row already exists. Becomes `409`.
    #[error("Entity already exists")]
    EntityAlreadyExists,
    /// The row does not exist. Becomes `404`.
    #[error("Entity not found")]
    EntityNotFound,
    /// Failed validation, as JSON.
    #[error("{0}")]
    Custom(String),
    /// A database failure.
    #[error(transparent)]
    Sqlx(#[from] sqlx::Error),
    /// A free-form failure.
    #[error("{0}")]
    Message(String),
}

/// Result alias using [`ModelError`].
pub type ModelResult<T, E = ModelError> = Result<T, E>;

impl ModelError {
    /// Keep only an error's text.
    #[must_use]
    pub fn to_msg(err: impl std::fmt::Display) -> Self {
        Self::Message(err.to_string())
    }

    /// Build from text.
    #[must_use]
    pub fn msg(message: &str) -> Self {
        Self::Message(message.to_string())
    }
}

impl From<ModelError> for Error {
    fn from(error: ModelError) -> Self {
        match error {
            ModelError::EntityNotFound => Self::NotFound,
            ModelError::EntityAlreadyExists => Self::CustomError(
                StatusCode::CONFLICT,
                ErrorDetail::new("conflict", "Entity already exists"),
            ),
            ModelError::Sqlx(error) => Self::Sqlx(error),
            ModelError::Custom(message) | ModelError::Message(message) => Self::Message(message),
        }
    }
}

/// One rule a field failed.
#[derive(Debug, Serialize)]
struct Failure {
    /// The rule.
    code: String,
    /// The rule's message.
    message: Option<String>,
}

impl From<ValidationErrors> for ModelError {
    fn from(errors: ValidationErrors) -> Self {
        let fields: BTreeMap<String, Vec<Failure>> = errors
            .field_errors()
            .iter()
            .map(|(field, failures)| {
                let failures = failures
                    .iter()
                    .map(|failure| Failure {
                        code: failure.code.to_string(),
                        message: failure.message.as_ref().map(ToString::to_string),
                    })
                    .collect();
                ((*field).to_string(), failures)
            })
            .collect();
        Self::Custom(serde_json::to_string(&fields).unwrap_or_default())
    }
}
