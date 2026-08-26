//! Auth module.

use serde::{Deserialize, Serialize};

use crate::models::_entities::users;

/// Login response.
#[derive(Debug, Deserialize, Serialize)]
pub struct LoginResponse {
    /// Token.
    pub token: String,
    /// Pid.
    pub pid: String,
    /// Name.
    pub name: String,
    /// Is verified.
    pub is_verified: bool,
}

impl LoginResponse {
    /// New.
    #[must_use]
    pub fn new(user: &users::Model, token: &str) -> Self {
        Self {
            token: token.to_string(),
            pid: user.pid.to_string(),
            name: user.name.clone(),
            is_verified: user.email_verified_at.is_some(),
        }
    }
}

/// Current response.
#[derive(Debug, Deserialize, Serialize)]
pub struct CurrentResponse {
    /// Pid.
    pub pid: String,
    /// Name.
    pub name: String,
    /// Email.
    pub email: String,
}

impl CurrentResponse {
    /// New.
    #[must_use]
    pub fn new(user: &users::Model) -> Self {
        Self {
            pid: user.pid.to_string(),
            name: user.name.clone(),
            email: user.email.clone(),
        }
    }
}
