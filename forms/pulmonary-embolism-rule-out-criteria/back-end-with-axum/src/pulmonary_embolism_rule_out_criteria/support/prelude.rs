//! Common imports for this service's handlers and models.

pub use axa::{
    extract::{Json, Path, Query},
    format,
    pagination::{Page, PageParams},
    prelude::*,
};
pub use chrono::{DateTime as ChronoDateTime, FixedOffset, NaiveDate, NaiveTime};
pub use sqlx::PgPool;
pub use uuid::Uuid;
pub use validator::Validate;

pub use super::{
    db,
    model::{ModelError, ModelResult},
    PAGE_LIMITS,
};

/// A date.
pub type Date = NaiveDate;
/// A time of day.
pub type Time = NaiveTime;
/// A timestamp with its time zone offset.
pub type DateTimeWithTimeZone = ChronoDateTime<FixedOffset>;
