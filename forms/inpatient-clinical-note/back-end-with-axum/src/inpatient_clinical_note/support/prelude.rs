//! Common imports for this service's handlers and models.

pub use axa::{
    cursor_pagination::CursorPage,
    extract::{Json, Path, Query},
    format,
    prelude::*,
};
pub use axum::extract::OriginalUri;
pub use chrono::{DateTime as ChronoDateTime, FixedOffset, NaiveDate, NaiveTime};
pub use rust_decimal::Decimal;
pub use sqlx::PgPool;
pub use uuid::Uuid;
pub use validator::Validate;

pub use super::{
    cursor_page, db,
    model::{ModelError, ModelResult},
    PAGE_LIMITS,
};

/// A date.
pub type Date = NaiveDate;
/// A time of day.
pub type Time = NaiveTime;
/// A timestamp with its time zone offset.
pub type DateTimeWithTimeZone = ChronoDateTime<FixedOffset>;
