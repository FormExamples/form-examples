//! Common imports for this service's handlers and models.

pub use axa::{
    cursor_pagination::CursorPage,
    extract::{Json, Path, Query},
    format,
    prelude::*,
};
pub use axum::extract::OriginalUri;
pub use sqlx::PgPool;
pub use uuid::Uuid;
pub use validator::Validate;

pub use super::{
    cursor_page, db,
    model::{ModelError, ModelResult},
    PAGE_LIMITS,
};

/// A date.
pub type Date = jiff_sqlx::Date;
/// A time of day.
pub type Time = jiff_sqlx::Time;
/// A timestamp, an instant on the UTC timeline.
pub type DateTimeWithTimeZone = jiff_sqlx::Timestamp;
