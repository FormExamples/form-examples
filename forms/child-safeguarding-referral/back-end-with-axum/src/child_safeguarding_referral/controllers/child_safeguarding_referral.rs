#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::child_safeguarding_referrals::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub referrer_organisation: String,
    pub referred_at: Option<DateTimeWithTimeZone>,
    pub relationship_to_child: String,
    pub child_age: Option<f64>,
    pub child_setting: String,
    pub child_reference: String,
    pub child_ethnicity: String,
    pub child_first_language: String,
    pub child_disability: String,
    pub carers: String,
    pub household_members: String,
    pub other_children: String,
    pub professionals_involved: String,
    pub concern_description: String,
    pub concern_onset: String,
    pub child_disclosed: String,
    pub referrer_observations: String,
    pub primary_category: String,
    pub additional_categories: String,
    pub presenting_evidence: String,
    pub immediate_danger: String,
    pub child_whereabouts: String,
    pub who_with_child: String,
    pub alleged_person_in_contact: String,
    pub other_children_at_risk: String,
    pub consent_sought: String,
    pub consent_status: String,
    pub sharing_basis_without_consent: String,
    pub family_aware: String,
    pub unsafe_to_inform_reason: String,
    pub agencies_contacted: String,
    pub strategy_discussion_held: String,
    pub previous_safeguarding_history: String,
    pub requested_action: String,
    pub referrer_declaration: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO child_safeguarding_referrals (patient_id, clinician_id, \
            referrer_organisation, referred_at, relationship_to_child, child_age, \
            child_setting, child_reference, child_ethnicity, child_first_language, \
            child_disability, carers, household_members, other_children, \
            professionals_involved, concern_description, concern_onset, child_disclosed, \
            referrer_observations, primary_category, additional_categories, \
            presenting_evidence, immediate_danger, child_whereabouts, who_with_child, \
            alleged_person_in_contact, other_children_at_risk, consent_sought, \
            consent_status, sharing_basis_without_consent, family_aware, \
            unsafe_to_inform_reason, agencies_contacted, strategy_discussion_held, \
            previous_safeguarding_history, requested_action, referrer_declaration, notes) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, \
            $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, \
            $33, $34, $35, $36, $37, $38) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.referrer_organisation)
        .bind(self.referred_at)
        .bind(&self.relationship_to_child)
        .bind(self.child_age)
        .bind(&self.child_setting)
        .bind(&self.child_reference)
        .bind(&self.child_ethnicity)
        .bind(&self.child_first_language)
        .bind(&self.child_disability)
        .bind(&self.carers)
        .bind(&self.household_members)
        .bind(&self.other_children)
        .bind(&self.professionals_involved)
        .bind(&self.concern_description)
        .bind(&self.concern_onset)
        .bind(&self.child_disclosed)
        .bind(&self.referrer_observations)
        .bind(&self.primary_category)
        .bind(&self.additional_categories)
        .bind(&self.presenting_evidence)
        .bind(&self.immediate_danger)
        .bind(&self.child_whereabouts)
        .bind(&self.who_with_child)
        .bind(&self.alleged_person_in_contact)
        .bind(&self.other_children_at_risk)
        .bind(&self.consent_sought)
        .bind(&self.consent_status)
        .bind(&self.sharing_basis_without_consent)
        .bind(&self.family_aware)
        .bind(&self.unsafe_to_inform_reason)
        .bind(&self.agencies_contacted)
        .bind(&self.strategy_discussion_held)
        .bind(&self.previous_safeguarding_history)
        .bind(&self.requested_action)
        .bind(&self.referrer_declaration)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE child_safeguarding_referrals SET patient_id = $2, clinician_id = $3, \
            referrer_organisation = $4, referred_at = $5, relationship_to_child = $6, \
            child_age = $7, child_setting = $8, child_reference = $9, child_ethnicity = \
            $10, child_first_language = $11, child_disability = $12, carers = $13, \
            household_members = $14, other_children = $15, professionals_involved = $16, \
            concern_description = $17, concern_onset = $18, child_disclosed = $19, \
            referrer_observations = $20, primary_category = $21, additional_categories = \
            $22, presenting_evidence = $23, immediate_danger = $24, child_whereabouts = \
            $25, who_with_child = $26, alleged_person_in_contact = $27, \
            other_children_at_risk = $28, consent_sought = $29, consent_status = $30, \
            sharing_basis_without_consent = $31, family_aware = $32, \
            unsafe_to_inform_reason = $33, agencies_contacted = $34, \
            strategy_discussion_held = $35, previous_safeguarding_history = $36, \
            requested_action = $37, referrer_declaration = $38, notes = $39, updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.referrer_organisation)
        .bind(self.referred_at)
        .bind(&self.relationship_to_child)
        .bind(self.child_age)
        .bind(&self.child_setting)
        .bind(&self.child_reference)
        .bind(&self.child_ethnicity)
        .bind(&self.child_first_language)
        .bind(&self.child_disability)
        .bind(&self.carers)
        .bind(&self.household_members)
        .bind(&self.other_children)
        .bind(&self.professionals_involved)
        .bind(&self.concern_description)
        .bind(&self.concern_onset)
        .bind(&self.child_disclosed)
        .bind(&self.referrer_observations)
        .bind(&self.primary_category)
        .bind(&self.additional_categories)
        .bind(&self.presenting_evidence)
        .bind(&self.immediate_danger)
        .bind(&self.child_whereabouts)
        .bind(&self.who_with_child)
        .bind(&self.alleged_person_in_contact)
        .bind(&self.other_children_at_risk)
        .bind(&self.consent_sought)
        .bind(&self.consent_status)
        .bind(&self.sharing_basis_without_consent)
        .bind(&self.family_aware)
        .bind(&self.unsafe_to_inform_reason)
        .bind(&self.agencies_contacted)
        .bind(&self.strategy_discussion_held)
        .bind(&self.previous_safeguarding_history)
        .bind(&self.requested_action)
        .bind(&self.referrer_declaration)
        .bind(&self.notes)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/child_safeguarding_referrals/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
