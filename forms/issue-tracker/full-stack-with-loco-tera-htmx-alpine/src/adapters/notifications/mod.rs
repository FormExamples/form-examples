//! Outbound notification renderers.
//!
//! Each renderer turns a graded issue into the wire format of an
//! outbound channel (Slack Block Kit, MS Teams Adaptive Card, email).
//! No HTTP / SMTP transport — the caller is responsible for posting
//! the rendered payload to the right webhook URL or SMTP relay.

pub mod email;
pub mod slack;
pub mod teams;

use crate::scoring::types::CompositePriority;

/// Notifications fire only for issues at or above this composite priority.
/// `high` is the default — `low` and `moderate` are noise.
pub fn should_notify(composite: CompositePriority) -> bool {
    matches!(composite, CompositePriority::High | CompositePriority::Critical)
}
