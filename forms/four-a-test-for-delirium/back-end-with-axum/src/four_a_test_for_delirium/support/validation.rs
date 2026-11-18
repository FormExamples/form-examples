//! Request validation shared by the controllers.
//!
//! The rules on each controller's `Params` are derived from `sql/`: a `TEXT`
//! column gets a length cap, a `NUMERIC(p,s)` column the range its precision
//! allows, and a `DATE` column a plausible-year window. The database's own
//! `CHECK` constraints stay as the backstop; these give the caller a `422`
//! that names the field instead of a constraint failure.

use std::collections::BTreeMap;

use axa::prelude::{Error, ErrorDetail};
use axum::http::StatusCode;
use validator::{ValidationError, ValidationErrors};

use super::prelude::Date;

/// The longest free-text value accepted, in characters.
pub const TEXT_MAX: u64 = 10_000;

/// The earliest and latest year a stored date may have.
const YEAR_MIN: i16 = 1900;
const YEAR_MAX: i16 = 2200;

/// Reject a date whose year is outside `1900..=2200`.
///
/// # Errors
///
/// A `date_out_of_range` failure when the year is outside that window.
pub fn plausible_date(date: &Date) -> Result<(), ValidationError> {
    let year = date.to_jiff().year();
    if (YEAR_MIN..=YEAR_MAX).contains(&year) {
        Ok(())
    } else {
        Err(ValidationError::new("date_out_of_range"))
    }
}

/// A `422` naming each field that failed and the rule it failed, never the value.
#[must_use]
pub fn unprocessable(errors: &ValidationErrors) -> Error {
    let fields: BTreeMap<String, Vec<String>> = errors
        .field_errors()
        .iter()
        .map(|(field, failures)| {
            let codes = failures.iter().map(|f| f.code.to_string()).collect();
            (camel_case(field), codes)
        })
        .collect();
    Error::CustomError(
        StatusCode::UNPROCESSABLE_ENTITY,
        ErrorDetail {
            code: Some("validation".to_string()),
            detail: None,
            errors: serde_json::to_value(fields).ok(),
        },
    )
}

/// `birth_date` as `birthDate`: the API names fields as the client sent them.
fn camel_case(snake: &str) -> String {
    let mut out = String::with_capacity(snake.len());
    let mut upper = false;
    for c in snake.chars() {
        if c == '_' {
            upper = true;
        } else if upper {
            out.extend(c.to_uppercase());
            upper = false;
        } else {
            out.push(c);
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use jiff_sqlx::ToSqlx;

    use super::*;

    fn date(year: i16) -> Date {
        jiff::civil::date(year, 1, 1).to_sqlx()
    }

    #[test]
    fn a_plausible_year_is_accepted() {
        assert!(plausible_date(&date(1990)).is_ok());
        assert!(plausible_date(&date(1900)).is_ok());
        assert!(plausible_date(&date(2200)).is_ok());
    }

    #[test]
    fn an_implausible_year_is_refused() {
        assert!(plausible_date(&date(1899)).is_err());
        assert!(plausible_date(&date(9999)).is_err());
    }

    #[test]
    fn field_names_are_camel_case() {
        assert_eq!(camel_case("birth_date"), "birthDate");
        assert_eq!(camel_case("name"), "name");
        assert_eq!(camel_case("country_as_iso_3166_1_alpha_2"), "countryAsIso31661Alpha2");
    }
}
