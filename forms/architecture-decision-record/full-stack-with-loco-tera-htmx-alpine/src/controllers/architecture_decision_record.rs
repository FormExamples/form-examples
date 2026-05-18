#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};
use sea_orm::{sea_query::Order, QueryOrder, QuerySelect};

use axum::http::header;
use axum::response::IntoResponse;

use crate::{
    models::_entities::{
        architecture_decision_record_notes,
        architecture_decision_record_positions,
        architecture_decision_records::{ActiveModel, Column, Entity, Model},
        authors,
        organizations,
    },
    views,
};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Params {
    pub author_id: i32,
    pub organization_id: i32,
    pub slug: Option<String>,
    pub number: Option<i32>,
    pub title: String,
    pub decision_date: Option<Date>,
    pub status: Option<String>,
    pub decision_group: Option<String>,
    pub issue: Option<String>,
    pub decision: Option<String>,
    pub assumptions: Option<String>,
    pub constraints: Option<String>,
    pub argument: Option<String>,
    pub implications: Option<String>,
    pub related_decisions: Option<String>,
    pub related_requirements: Option<String>,
    pub related_artifacts: Option<String>,
    pub related_principles: Option<String>,
    pub signed_off_by: Option<String>,
    pub signed_off_at: Option<DateTimeWithTimeZone>,
    }

/// Permitted values for the `status` enum; mirrors the SQL CHECK constraint
/// on `architecture_decision_records.status`. An empty string is also
/// allowed since SQL defaults to it for unset rows.
pub const VALID_STATUSES: &[&str] = &[
    "pending",
    "decided",
    "approved",
    "superseded",
    "deprecated",
    "",
];

/// Permitted values for the `decision_group` enum; mirrors the SQL CHECK
/// constraint on `architecture_decision_records.decision_group`.
pub const VALID_GROUPS: &[&str] = &[
    "business",
    "data",
    "integration",
    "presentation",
    "security",
    "infrastructure",
    "operations",
    "governance",
    "other",
    "",
];

/// Derive a URL-safe slug from a free-text title.
/// Lowercases, replaces any run of non-alphanumeric chars with a single
/// hyphen, and trims leading/trailing hyphens. Examples:
///   "Use PostgreSQL for primary storage" → "use-postgresql-for-primary-storage"
///   "  Multiple   spaces & symbols!"     → "multiple-spaces-symbols"
///   ""                                   → ""
pub fn slugify(title: &str) -> String {
    let mut out = String::with_capacity(title.len());
    let mut prev_hyphen = true;
    for ch in title.chars() {
        if ch.is_ascii_alphanumeric() {
            for low in ch.to_lowercase() {
                out.push(low);
            }
            prev_hyphen = false;
        } else if !prev_hyphen {
            out.push('-');
            prev_hyphen = true;
        }
    }
    if out.ends_with('-') {
        out.pop();
    }
    out
}

impl Params {
    /// Validate `Params` against the SQL CHECK constraints so users get a
    /// readable error rather than a Postgres constraint-violation surface.
    fn validate(&self) -> Result<()> {
        if self.title.trim().is_empty() {
            return Err(Error::BadRequest("title is required".to_string()));
        }
        if let Some(s) = &self.status {
            if !VALID_STATUSES.contains(&s.as_str()) {
                return Err(Error::BadRequest(format!(
                    "status `{}` is not one of {:?}",
                    s, VALID_STATUSES
                )));
            }
        }
        if let Some(g) = &self.decision_group {
            if !VALID_GROUPS.contains(&g.as_str()) {
                return Err(Error::BadRequest(format!(
                    "decision_group `{}` is not one of {:?}",
                    g, VALID_GROUPS
                )));
            }
        }
        Ok(())
    }

    fn update(&self, item: &mut ActiveModel) {
      item.author_id = Set(self.author_id);
      item.organization_id = Set(self.organization_id);
      item.slug = Set(self.slug.clone());
      item.number = Set(self.number);
      item.title = Set(self.title.clone());
      item.decision_date = Set(self.decision_date);
      item.status = Set(self.status.clone());
      item.decision_group = Set(self.decision_group.clone());
      item.issue = Set(self.issue.clone());
      item.decision = Set(self.decision.clone());
      item.assumptions = Set(self.assumptions.clone());
      item.constraints = Set(self.constraints.clone());
      item.argument = Set(self.argument.clone());
      item.implications = Set(self.implications.clone());
      item.related_decisions = Set(self.related_decisions.clone());
      item.related_requirements = Set(self.related_requirements.clone());
      item.related_artifacts = Set(self.related_artifacts.clone());
      item.related_principles = Set(self.related_principles.clone());
      item.signed_off_by = Set(self.signed_off_by.clone());
      item.signed_off_at = Set(self.signed_off_at);
      }
}

async fn load_item(ctx: &AppContext, id: i32) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    ViewEngine(v): ViewEngine<TeraView>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = Entity::find()
        .order_by(Column::Id, Order::Desc)
        .all(&ctx.db)
        .await?;
    views::architecture_decision_record::list(&v, &item)
}

#[debug_handler]
pub async fn new(
    ViewEngine(v): ViewEngine<TeraView>,
    State(_ctx): State<AppContext>,
) -> Result<Response> {
    views::architecture_decision_record::create(&v)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    params.validate()?;
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let _ = item.update(&ctx.db).await?;
    format::render().redirect_with_header_key("HX-Redirect", "/architecture_decision_records")
}

#[debug_handler]
pub async fn edit(
    Path(id): Path<i32>,
    ViewEngine(v): ViewEngine<TeraView>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    views::architecture_decision_record::edit(&v, &item)
}

#[debug_handler]
pub async fn show(
    Path(id): Path<i32>,
    ViewEngine(v): ViewEngine<TeraView>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;

    let author = authors::Entity::find_by_id(item.author_id)
        .one(&ctx.db)
        .await?;
    let organization = organizations::Entity::find_by_id(item.organization_id)
        .one(&ctx.db)
        .await?;
    let positions = architecture_decision_record_positions::Entity::find()
        .filter(
            architecture_decision_record_positions::Column::ArchitectureDecisionRecordId.eq(id),
        )
        .order_by(architecture_decision_record_positions::Column::Ordinal, Order::Asc)
        .order_by(architecture_decision_record_positions::Column::Id, Order::Asc)
        .all(&ctx.db)
        .await?;
    let notes = architecture_decision_record_notes::Entity::find()
        .filter(architecture_decision_record_notes::Column::ArchitectureDecisionRecordId.eq(id))
        .order_by(architecture_decision_record_notes::Column::NotedAt, Order::Asc)
        .order_by(architecture_decision_record_notes::Column::Id, Order::Asc)
        .all(&ctx.db)
        .await?;

    format::render().view(
        &v,
        "architecture_decision_record/show.html",
        data!({
            "item": item,
            "author": author,
            "organization": organization,
            "positions": positions,
            "notes": notes,
        }),
    )
}

#[debug_handler]
pub async fn add(
    State(ctx): State<AppContext>,
    Json(mut params): Json<Params>,
) -> Result<Response> {
    params.validate()?;
    // Auto-assign the next sequential ADR number when the caller omits it.
    // MAX(number) ignores rows where number IS NULL; the register starts at 1.
    if params.number.is_none() {
        let row: Option<(Option<i32>,)> = Entity::find()
            .select_only()
            .column_as(Column::Number.max(), "max")
            .into_tuple()
            .one(&ctx.db)
            .await?;
        let max = row.and_then(|(m,)| m).unwrap_or(0);
        params.number = Some(max + 1);
    }
    // Auto-derive slug from title when missing.
    if params.slug.as_deref().unwrap_or("").trim().is_empty() {
        let derived = slugify(&params.title);
        if !derived.is_empty() {
            params.slug = Some(derived);
        }
    }
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let _ = item.insert(&ctx.db).await?;
    format::render().redirect_with_header_key("HX-Redirect", "/architecture_decision_records")
}

#[debug_handler]
pub async fn remove(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

fn bullets(text: &Option<String>) -> String {
    let raw = text.clone().unwrap_or_default();
    let lines: Vec<&str> = raw
        .lines()
        .map(str::trim)
        .filter(|l| !l.is_empty())
        .collect();
    if lines.is_empty() {
        "_None._\n".to_string()
    } else {
        let mut out = String::new();
        for l in lines {
            out.push_str("- ");
            out.push_str(l);
            out.push('\n');
        }
        out
    }
}

fn pad4(n: Option<i32>) -> String {
    match n {
        Some(v) => format!("{:04}", v),
        None => "NNNN".to_string(),
    }
}

/// Render an ADR (and its joined positions, notes, author, organization) as
/// a Tyree & Akerman Markdown document. Shared by the HTML `/markdown`
/// endpoint and the JSON `/api/adrs/:slug` viewer endpoint.
async fn render_markdown(ctx: &AppContext, item: &Model) -> Result<String> {
    let id = item.id;
    let author = authors::Entity::find_by_id(item.author_id)
        .one(&ctx.db)
        .await?;
    let org = organizations::Entity::find_by_id(item.organization_id)
        .one(&ctx.db)
        .await?;
    let positions = architecture_decision_record_positions::Entity::find()
        .filter(architecture_decision_record_positions::Column::ArchitectureDecisionRecordId.eq(id))
        .order_by(architecture_decision_record_positions::Column::Ordinal, Order::Asc)
        .all(&ctx.db)
        .await?;
    let notes = architecture_decision_record_notes::Entity::find()
        .filter(architecture_decision_record_notes::Column::ArchitectureDecisionRecordId.eq(id))
        .order_by(architecture_decision_record_notes::Column::NotedAt, Order::Asc)
        .all(&ctx.db)
        .await?;

    let mut md = String::new();
    let heading = format!("{} — {}", pad4(item.number), item.title);
    md.push_str(&format!("# {}\n\n", heading));
    md.push_str(&format!(
        "- **Status:** {}\n",
        item.status.clone().unwrap_or_else(|| "pending".to_string())
    ));
    if let Some(g) = item.decision_group.clone().filter(|s| !s.is_empty()) {
        md.push_str(&format!("- **Group:** {}\n", g));
    }
    if let Some(d) = item.decision_date {
        md.push_str(&format!("- **Date:** {}\n", d));
    }
    if let Some(a) = &author {
        let email = a.email.clone().map(|e| format!(" <{}>", e)).unwrap_or_default();
        let role = a.role.clone().map(|r| format!(" ({})", r)).unwrap_or_default();
        md.push_str(&format!("- **Author:** {}{}{}\n", a.name, email, role));
    }
    if let Some(o) = &org {
        md.push_str(&format!("- **Organization:** {}\n", o.name));
    }
    md.push('\n');

    let section = |md: &mut String, heading: &str, body: &Option<String>| {
        md.push_str(&format!("## {}\n", heading));
        let b = body.clone().unwrap_or_default();
        md.push_str(if b.trim().is_empty() { "_TBD_" } else { &b });
        md.push_str("\n\n");
    };

    section(&mut md, "Issue",       &item.issue);
    section(&mut md, "Decision",    &item.decision);
    section(&mut md, "Assumptions", &item.assumptions);
    section(&mut md, "Constraints", &item.constraints);

    md.push_str("## Positions\n");
    if positions.is_empty() {
        md.push_str("_None._\n");
    } else {
        for (i, p) in positions.iter().enumerate() {
            let chosen = if p.is_chosen.unwrap_or(false) { "  ✓ chosen" } else { "" };
            md.push_str(&format!("### {}. {}{}\n", i + 1, p.name, chosen));
            if let Some(d) = p.description.clone().filter(|s| !s.is_empty()) {
                md.push_str(&d);
                md.push('\n');
            }
            if let Some(u) = p.model_or_diagram_url.clone().filter(|s| !s.is_empty()) {
                md.push_str(&format!("Model/diagram: <{}>\n", u));
            }
            if let Some(pr) = &p.pros {
                if !pr.trim().is_empty() {
                    md.push_str("\n**Pros:**\n");
                    md.push_str(&bullets(&Some(pr.clone())));
                }
            }
            if let Some(co) = &p.cons {
                if !co.trim().is_empty() {
                    md.push_str("**Cons:**\n");
                    md.push_str(&bullets(&Some(co.clone())));
                }
            }
            md.push('\n');
        }
    }
    md.push('\n');

    section(&mut md, "Argument",     &item.argument);
    section(&mut md, "Implications", &item.implications);

    md.push_str("## Related Decisions\n");
    md.push_str(&bullets(&item.related_decisions));
    md.push_str("## Related Requirements\n");
    md.push_str(&bullets(&item.related_requirements));
    md.push_str("## Related Artifacts\n");
    md.push_str(&bullets(&item.related_artifacts));
    md.push_str("## Related Principles\n");
    md.push_str(&bullets(&item.related_principles));

    md.push_str("## Notes\n");
    if notes.is_empty() {
        md.push_str("_None._\n");
    } else {
        for n in &notes {
            let when = n
                .noted_at
                .map(|d| d.to_rfc3339())
                .unwrap_or_else(|| n.created_at.to_rfc3339());
            let who = n.noted_by.clone().unwrap_or_else(|| "unknown".to_string());
            md.push_str(&format!("- **{}** ({}): {}\n", when, who, n.body));
        }
    }
    md.push('\n');

    if let Some(by) = item.signed_off_by.clone().filter(|s| !s.is_empty()) {
        md.push_str("---\n");
        let when = item
            .signed_off_at
            .map(|d| format!(" on {}", d.to_rfc3339()))
            .unwrap_or_default();
        md.push_str(&format!("Signed off by {}{}.\n", by, when));
    }

    Ok(md)
}

#[debug_handler]
pub async fn markdown(
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
) -> Result<axum::response::Response> {
    let item = load_item(&ctx, id).await?;
    let md = render_markdown(&ctx, &item).await?;
    Ok((
        [(header::CONTENT_TYPE, "text/markdown; charset=utf-8")],
        md,
    )
        .into_response())
}

/// JSON ADR view by slug. Returns the row metadata plus the rendered
/// Markdown body, so the SvelteKit dashboard's `[slug]` route can render
/// inline without a second round trip.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct AdrViewApi {
    id: String,
    number: Option<i32>,
    slug: String,
    title: String,
    status: String,
    decision_group: String,
    decision_date: String,
    author_name: String,
    markdown: String,
}

#[debug_handler]
pub async fn api_show_by_slug(
    Path(slug): Path<String>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = Entity::find()
        .filter(Column::Slug.eq(&slug))
        .one(&ctx.db)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    let id = item.id;
    let author_name = authors::Entity::find_by_id(item.author_id)
        .one(&ctx.db)
        .await?
        .map(|a| a.name)
        .unwrap_or_default();
    let md = render_markdown(&ctx, &item).await?;

    format::json(AdrViewApi {
        id: id.to_string(),
        number: item.number,
        slug: item.slug.clone().unwrap_or_default(),
        title: item.title.clone(),
        status: item.status.clone().unwrap_or_default(),
        decision_group: item.decision_group.clone().unwrap_or_default(),
        decision_date: item
            .decision_date
            .map(|d| d.to_string())
            .unwrap_or_default(),
        author_name,
        markdown: md,
    })
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PositionForm {
    pub name: String,
    pub description: Option<String>,
    pub model_or_diagram_url: Option<String>,
    pub is_chosen: Option<String>,
}

async fn render_positions_partial(
    v: &TeraView,
    ctx: &AppContext,
    adr_id: i32,
) -> Result<Response> {
    let positions = architecture_decision_record_positions::Entity::find()
        .filter(architecture_decision_record_positions::Column::ArchitectureDecisionRecordId.eq(adr_id))
        .order_by(architecture_decision_record_positions::Column::Ordinal, Order::Asc)
        .order_by(architecture_decision_record_positions::Column::Id, Order::Asc)
        .all(&ctx.db)
        .await?;
    views::architecture_decision_record::positions_partial(v, adr_id, &positions)
}

#[debug_handler]
pub async fn positions_index(
    ViewEngine(v): ViewEngine<TeraView>,
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let _ = load_item(&ctx, id).await?;
    render_positions_partial(&v, &ctx, id).await
}

#[debug_handler]
pub async fn positions_create(
    ViewEngine(v): ViewEngine<TeraView>,
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
    axum_extra::extract::Form(form): axum_extra::extract::Form<PositionForm>,
) -> Result<Response> {
    let _ = load_item(&ctx, id).await?;
    let is_chosen = form
        .is_chosen
        .as_deref()
        .map(|v| matches!(v, "true" | "on" | "1"));
    let mut item = architecture_decision_record_positions::ActiveModel {
        architecture_decision_record_id: Set(id),
        name: Set(form.name),
        description: Set(form.description.filter(|s| !s.is_empty())),
        model_or_diagram_url: Set(form.model_or_diagram_url.filter(|s| !s.is_empty())),
        is_chosen: Set(is_chosen),
        ..Default::default()
    };
    if is_chosen == Some(true) {
        architecture_decision_record_positions::Entity::update_many()
            .filter(
                architecture_decision_record_positions::Column::ArchitectureDecisionRecordId.eq(id),
            )
            .col_expr(
                architecture_decision_record_positions::Column::IsChosen,
                sea_orm::sea_query::Expr::value(false),
            )
            .exec(&ctx.db)
            .await?;
        item.is_chosen = Set(Some(true));
    }
    item.insert(&ctx.db).await?;
    render_positions_partial(&v, &ctx, id).await
}

#[debug_handler]
pub async fn positions_remove(
    ViewEngine(v): ViewEngine<TeraView>,
    Path((id, position_id)): Path<(i32, i32)>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let _ = load_item(&ctx, id).await?;
    architecture_decision_record_positions::Entity::delete_by_id(position_id)
        .exec(&ctx.db)
        .await?;
    render_positions_partial(&v, &ctx, id).await
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct NoteForm {
    pub noted_by: Option<String>,
    pub body: String,
}

async fn render_notes_partial(
    v: &TeraView,
    ctx: &AppContext,
    adr_id: i32,
) -> Result<Response> {
    let notes = architecture_decision_record_notes::Entity::find()
        .filter(architecture_decision_record_notes::Column::ArchitectureDecisionRecordId.eq(adr_id))
        .order_by(architecture_decision_record_notes::Column::NotedAt, Order::Asc)
        .order_by(architecture_decision_record_notes::Column::Id, Order::Asc)
        .all(&ctx.db)
        .await?;
    views::architecture_decision_record::notes_partial(v, adr_id, &notes)
}

#[debug_handler]
pub async fn notes_index(
    ViewEngine(v): ViewEngine<TeraView>,
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let _ = load_item(&ctx, id).await?;
    render_notes_partial(&v, &ctx, id).await
}

#[debug_handler]
pub async fn notes_create(
    ViewEngine(v): ViewEngine<TeraView>,
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
    axum_extra::extract::Form(form): axum_extra::extract::Form<NoteForm>,
) -> Result<Response> {
    let _ = load_item(&ctx, id).await?;
    let item = architecture_decision_record_notes::ActiveModel {
        architecture_decision_record_id: Set(id),
        noted_at: Set(Some(chrono::Utc::now().into())),
        noted_by: Set(form.noted_by.filter(|s| !s.is_empty())),
        body: Set(form.body),
        ..Default::default()
    };
    item.insert(&ctx.db).await?;
    render_notes_partial(&v, &ctx, id).await
}

#[debug_handler]
pub async fn notes_remove(
    ViewEngine(v): ViewEngine<TeraView>,
    Path((id, note_id)): Path<(i32, i32)>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let _ = load_item(&ctx, id).await?;
    architecture_decision_record_notes::Entity::delete_by_id(note_id)
        .exec(&ctx.db)
        .await?;
    render_notes_partial(&v, &ctx, id).await
}

/// JSON shape consumed by the SvelteKit dashboard's `AdrRow` interface.
/// Field names match the front-end's camelCase convention (see
/// `front-end-dashboard-with-svelte/src/lib/data/sample.ts`).
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct AdrRowApi {
    id: String,
    number: Option<i32>,
    slug: String,
    title: String,
    status: String,
    decision_group: String,
    decision_date: String,
    author_name: String,
    markdown_url: String,
}

#[debug_handler]
pub async fn api_index(State(ctx): State<AppContext>) -> Result<Response> {
    let rows = Entity::find()
        .order_by(Column::Number, Order::Asc)
        .order_by(Column::Id, Order::Asc)
        .all(&ctx.db)
        .await?;

    let mut out: Vec<AdrRowApi> = Vec::with_capacity(rows.len());
    for r in rows {
        let author_name = authors::Entity::find_by_id(r.author_id)
            .one(&ctx.db)
            .await?
            .map(|a| a.name)
            .unwrap_or_default();
        out.push(AdrRowApi {
            id: r.id.to_string(),
            number: r.number,
            slug: r.slug.clone().unwrap_or_default(),
            title: r.title,
            status: r.status.unwrap_or_default(),
            decision_group: r.decision_group.unwrap_or_default(),
            decision_date: r
                .decision_date
                .map(|d| d.to_string())
                .unwrap_or_default(),
            author_name,
            markdown_url: format!("/architecture_decision_records/{}/markdown", r.id),
        });
    }
    format::json(out)
}

pub fn api_routes() -> Routes {
    Routes::new()
        .prefix("api/adrs")
        .add("/", get(api_index))
        .add("{slug}", get(api_show_by_slug))
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("architecture_decision_records/")
        .add("/", get(list))
        .add("/", post(add))
        .add("new", get(new))
        .add("{id}", get(show))
        .add("{id}/edit", get(edit))
        .add("{id}/markdown", get(markdown))
        .add("{id}/positions", get(positions_index))
        .add("{id}/positions", post(positions_create))
        .add("{id}/positions/{position_id}", delete(positions_remove))
        .add("{id}/notes", get(notes_index))
        .add("{id}/notes", post(notes_create))
        .add("{id}/notes/{note_id}", delete(notes_remove))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn base_params() -> Params {
        Params {
            author_id: 1,
            organization_id: 1,
            slug: None,
            number: None,
            title: "Test".to_string(),
            decision_date: None,
            status: None,
            decision_group: None,
            issue: None,
            decision: None,
            assumptions: None,
            constraints: None,
            argument: None,
            implications: None,
            related_decisions: None,
            related_requirements: None,
            related_artifacts: None,
            related_principles: None,
            signed_off_by: None,
            signed_off_at: None,
        }
    }

    #[test]
    fn validate_accepts_known_status() {
        let mut p = base_params();
        for s in &["pending", "decided", "approved", "superseded", "deprecated", ""] {
            p.status = Some((*s).to_string());
            assert!(p.validate().is_ok(), "status {} should validate", s);
        }
    }

    #[test]
    fn validate_rejects_unknown_status() {
        let mut p = base_params();
        p.status = Some("provisional".to_string());
        assert!(p.validate().is_err());
    }

    #[test]
    fn validate_accepts_known_group() {
        let mut p = base_params();
        for g in &[
            "business",
            "data",
            "integration",
            "presentation",
            "security",
            "infrastructure",
            "operations",
            "governance",
            "other",
            "",
        ] {
            p.decision_group = Some((*g).to_string());
            assert!(p.validate().is_ok(), "group {} should validate", g);
        }
    }

    #[test]
    fn validate_rejects_unknown_group() {
        let mut p = base_params();
        p.decision_group = Some("legal".to_string());
        assert!(p.validate().is_err());
    }

    #[test]
    fn validate_requires_title() {
        let mut p = base_params();
        p.title = "   ".to_string();
        assert!(p.validate().is_err());
    }

    #[test]
    fn slugify_handles_common_titles() {
        assert_eq!(
            slugify("Use PostgreSQL for primary storage"),
            "use-postgresql-for-primary-storage"
        );
        assert_eq!(
            slugify("  Multiple   spaces & symbols!"),
            "multiple-spaces-symbols"
        );
        assert_eq!(slugify("ADR 0042: pick a thing"), "adr-0042-pick-a-thing");
        assert_eq!(slugify(""), "");
        assert_eq!(slugify("---"), "");
        assert_eq!(slugify("---trim-leading---"), "trim-leading");
        // Unicode letters: stripped because we restrict to ASCII alphanumeric.
        assert_eq!(slugify("Café résumé"), "caf-r-sum");
    }
}
