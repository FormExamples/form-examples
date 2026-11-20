#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_states_last_will_and_testaments::Model;
use crate::support::validation::{plausible_date, unprocessable, TEXT_MAX};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub testator_id: Uuid,
    pub attorney_id: Option<Uuid>,
    pub state: String,
    #[validate(length(max = TEXT_MAX))]
    pub testator_name: String,
    #[validate(custom(function = "plausible_date"))]
    pub testator_date_of_birth: Option<Date>,
    pub sound_mind: String,
    pub undue_influence_concern: String,
    pub marital_status: String,
    #[validate(length(max = TEXT_MAX))]
    pub spouse_name: String,
    #[validate(range(min = -999999999999.99, max = 999999999999.99))]
    pub spouse_inheritance_value: Option<f64>,
    pub spouse_waived_elective_share: String,
    pub has_minor_children: String,
    #[validate(length(max = TEXT_MAX))]
    pub guardian_for_minors_name: String,
    pub disinherits_child: String,
    pub disinherited_child_named: String,
    #[validate(range(min = -999999999999.99, max = 999999999999.99))]
    pub estimated_estate_value: Option<f64>,
    #[validate(range(min = -999999999999.99, max = 999999999999.99))]
    pub specific_bequests_total: Option<f64>,
    #[validate(length(max = TEXT_MAX))]
    pub specific_bequests_summary: String,
    pub residuary_clause_present: String,
    #[validate(length(max = TEXT_MAX))]
    pub residuary_1_name: String,
    #[validate(range(min = -999.99, max = 999.99))]
    pub residuary_1_percent: Option<f64>,
    #[validate(length(max = TEXT_MAX))]
    pub residuary_2_name: String,
    #[validate(range(min = -999.99, max = 999.99))]
    pub residuary_2_percent: Option<f64>,
    #[validate(length(max = TEXT_MAX))]
    pub residuary_3_name: String,
    #[validate(range(min = -999.99, max = 999.99))]
    pub residuary_3_percent: Option<f64>,
    pub contingent_beneficiary_named: String,
    #[validate(length(max = TEXT_MAX))]
    pub personal_representative_name: String,
    #[validate(length(max = TEXT_MAX))]
    pub successor_personal_representative_name: String,
    pub bond_waived: String,
    pub revokes_prior_wills_clause: String,
    pub no_contest_clause: String,
    pub digital_assets_clause: String,
    pub estate_tax_reviewed: String,
    #[validate(length(max = TEXT_MAX))]
    pub original_will_location: String,
    #[validate(length(max = TEXT_MAX))]
    pub drafter_note: String,
    pub execution_form: String,
    #[validate(custom(function = "plausible_date"))]
    pub execution_date: Option<Date>,
    pub signed_at_end: String,
    pub signed_in_witness_presence: String,
    pub witnesses_signed_in_testator_presence: String,
    pub holographic_entirely_handwritten: String,
    #[validate(length(max = TEXT_MAX))]
    pub witness_1_name: String,
    pub witness_1_beneficiary: String,
    #[validate(length(max = TEXT_MAX))]
    pub witness_2_name: String,
    pub witness_2_beneficiary: String,
    #[validate(length(max = TEXT_MAX))]
    pub witness_3_name: String,
    pub witness_3_beneficiary: String,
    pub self_proving_affidavit: String,
    #[validate(length(max = TEXT_MAX))]
    pub notary_name: String,
    pub notary_acknowledged: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_states_last_will_and_testaments (testator_id, attorney_id, \
            state, testator_name, testator_date_of_birth, sound_mind, undue_influence_concern, \
            marital_status, spouse_name, spouse_inheritance_value, \
            spouse_waived_elective_share, has_minor_children, guardian_for_minors_name, \
            disinherits_child, disinherited_child_named, estimated_estate_value, \
            specific_bequests_total, specific_bequests_summary, residuary_clause_present, \
            residuary_1_name, residuary_1_percent, residuary_2_name, residuary_2_percent, \
            residuary_3_name, residuary_3_percent, contingent_beneficiary_named, \
            personal_representative_name, successor_personal_representative_name, bond_waived, \
            revokes_prior_wills_clause, no_contest_clause, digital_assets_clause, \
            estate_tax_reviewed, original_will_location, drafter_note, execution_form, \
            execution_date, signed_at_end, signed_in_witness_presence, \
            witnesses_signed_in_testator_presence, holographic_entirely_handwritten, \
            witness_1_name, witness_1_beneficiary, witness_2_name, witness_2_beneficiary, \
            witness_3_name, witness_3_beneficiary, self_proving_affidavit, notary_name, \
            notary_acknowledged) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, \
            $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, \
            $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, \
            $45, $46, $47, $48, $49, $50) RETURNING *",
        )
        .bind(self.testator_id)
        .bind(self.attorney_id)
        .bind(&self.state)
        .bind(&self.testator_name)
        .bind(self.testator_date_of_birth)
        .bind(&self.sound_mind)
        .bind(&self.undue_influence_concern)
        .bind(&self.marital_status)
        .bind(&self.spouse_name)
        .bind(self.spouse_inheritance_value)
        .bind(&self.spouse_waived_elective_share)
        .bind(&self.has_minor_children)
        .bind(&self.guardian_for_minors_name)
        .bind(&self.disinherits_child)
        .bind(&self.disinherited_child_named)
        .bind(self.estimated_estate_value)
        .bind(self.specific_bequests_total)
        .bind(&self.specific_bequests_summary)
        .bind(&self.residuary_clause_present)
        .bind(&self.residuary_1_name)
        .bind(self.residuary_1_percent)
        .bind(&self.residuary_2_name)
        .bind(self.residuary_2_percent)
        .bind(&self.residuary_3_name)
        .bind(self.residuary_3_percent)
        .bind(&self.contingent_beneficiary_named)
        .bind(&self.personal_representative_name)
        .bind(&self.successor_personal_representative_name)
        .bind(&self.bond_waived)
        .bind(&self.revokes_prior_wills_clause)
        .bind(&self.no_contest_clause)
        .bind(&self.digital_assets_clause)
        .bind(&self.estate_tax_reviewed)
        .bind(&self.original_will_location)
        .bind(&self.drafter_note)
        .bind(&self.execution_form)
        .bind(self.execution_date)
        .bind(&self.signed_at_end)
        .bind(&self.signed_in_witness_presence)
        .bind(&self.witnesses_signed_in_testator_presence)
        .bind(&self.holographic_entirely_handwritten)
        .bind(&self.witness_1_name)
        .bind(&self.witness_1_beneficiary)
        .bind(&self.witness_2_name)
        .bind(&self.witness_2_beneficiary)
        .bind(&self.witness_3_name)
        .bind(&self.witness_3_beneficiary)
        .bind(&self.self_proving_affidavit)
        .bind(&self.notary_name)
        .bind(&self.notary_acknowledged)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_states_last_will_and_testaments SET testator_id = $2, attorney_id = \
            $3, state = $4, testator_name = $5, testator_date_of_birth = $6, sound_mind = $7, \
            undue_influence_concern = $8, marital_status = $9, spouse_name = $10, \
            spouse_inheritance_value = $11, spouse_waived_elective_share = $12, \
            has_minor_children = $13, guardian_for_minors_name = $14, disinherits_child = $15, \
            disinherited_child_named = $16, estimated_estate_value = $17, \
            specific_bequests_total = $18, specific_bequests_summary = $19, \
            residuary_clause_present = $20, residuary_1_name = $21, residuary_1_percent = $22, \
            residuary_2_name = $23, residuary_2_percent = $24, residuary_3_name = $25, \
            residuary_3_percent = $26, contingent_beneficiary_named = $27, \
            personal_representative_name = $28, successor_personal_representative_name = $29, \
            bond_waived = $30, revokes_prior_wills_clause = $31, no_contest_clause = $32, \
            digital_assets_clause = $33, estate_tax_reviewed = $34, original_will_location = \
            $35, drafter_note = $36, execution_form = $37, execution_date = $38, signed_at_end \
            = $39, signed_in_witness_presence = $40, witnesses_signed_in_testator_presence = \
            $41, holographic_entirely_handwritten = $42, witness_1_name = $43, \
            witness_1_beneficiary = $44, witness_2_name = $45, witness_2_beneficiary = $46, \
            witness_3_name = $47, witness_3_beneficiary = $48, self_proving_affidavit = $49, \
            notary_name = $50, notary_acknowledged = $51, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.testator_id)
        .bind(self.attorney_id)
        .bind(&self.state)
        .bind(&self.testator_name)
        .bind(self.testator_date_of_birth)
        .bind(&self.sound_mind)
        .bind(&self.undue_influence_concern)
        .bind(&self.marital_status)
        .bind(&self.spouse_name)
        .bind(self.spouse_inheritance_value)
        .bind(&self.spouse_waived_elective_share)
        .bind(&self.has_minor_children)
        .bind(&self.guardian_for_minors_name)
        .bind(&self.disinherits_child)
        .bind(&self.disinherited_child_named)
        .bind(self.estimated_estate_value)
        .bind(self.specific_bequests_total)
        .bind(&self.specific_bequests_summary)
        .bind(&self.residuary_clause_present)
        .bind(&self.residuary_1_name)
        .bind(self.residuary_1_percent)
        .bind(&self.residuary_2_name)
        .bind(self.residuary_2_percent)
        .bind(&self.residuary_3_name)
        .bind(self.residuary_3_percent)
        .bind(&self.contingent_beneficiary_named)
        .bind(&self.personal_representative_name)
        .bind(&self.successor_personal_representative_name)
        .bind(&self.bond_waived)
        .bind(&self.revokes_prior_wills_clause)
        .bind(&self.no_contest_clause)
        .bind(&self.digital_assets_clause)
        .bind(&self.estate_tax_reviewed)
        .bind(&self.original_will_location)
        .bind(&self.drafter_note)
        .bind(&self.execution_form)
        .bind(self.execution_date)
        .bind(&self.signed_at_end)
        .bind(&self.signed_in_witness_presence)
        .bind(&self.witnesses_signed_in_testator_presence)
        .bind(&self.holographic_entirely_handwritten)
        .bind(&self.witness_1_name)
        .bind(&self.witness_1_beneficiary)
        .bind(&self.witness_2_name)
        .bind(&self.witness_2_beneficiary)
        .bind(&self.witness_3_name)
        .bind(&self.witness_3_beneficiary)
        .bind(&self.self_proving_affidavit)
        .bind(&self.notary_name)
        .bind(&self.notary_acknowledged)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
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
        .prefix("api/united_states_last_will_and_testaments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
