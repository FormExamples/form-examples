//! United kingdom last will and testament module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_last_will_and_testaments::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Testator id.
    pub testator_id: Uuid,
    /// Testator name.
    #[validate(length(max = TEXT_MAX))]
    pub testator_name: String,
    /// Date of birth.
    #[validate(custom(function = "plausible_date"))]
    pub date_of_birth: Option<Date>,
    /// Testator address.
    #[validate(length(max = TEXT_MAX))]
    pub testator_address: String,
    /// Domicile.
    pub domicile: String,
    /// Marital status.
    pub marital_status: String,
    /// Marriage expected.
    pub marriage_expected: String,
    /// Contemplation of marriage clause.
    pub contemplation_of_marriage_clause: String,
    /// Has mental capacity.
    pub has_mental_capacity: String,
    /// Made voluntarily.
    pub made_voluntarily: String,
    /// Previous will.
    pub previous_will: String,
    /// Revocation clause.
    pub revocation_clause: String,
    /// Estate value band.
    pub estate_value_band: String,
    /// Owns home.
    pub owns_home: String,
    /// Home to direct descendants.
    pub home_to_direct_descendants: String,
    /// Charity gift percent.
    #[validate(range(min = -999.99, max = 999.99))]
    pub charity_gift_percent: Option<f64>,
    /// Estate other jurisdictions.
    pub estate_other_jurisdictions: String,
    /// Other jurisdictions detail.
    #[validate(length(max = TEXT_MAX))]
    pub other_jurisdictions_detail: String,
    /// Specific gifts notes.
    #[validate(length(max = TEXT_MAX))]
    pub specific_gifts_notes: String,
    /// Executor first name.
    #[validate(length(max = TEXT_MAX))]
    pub executor_first_name: String,
    /// Executor first relationship.
    #[validate(length(max = TEXT_MAX))]
    pub executor_first_relationship: String,
    /// Executor second name.
    #[validate(length(max = TEXT_MAX))]
    pub executor_second_name: String,
    /// Executor second relationship.
    #[validate(length(max = TEXT_MAX))]
    pub executor_second_relationship: String,
    /// Executors adult confirmed.
    pub executors_adult_confirmed: String,
    /// Beneficiary first name.
    #[validate(length(max = TEXT_MAX))]
    pub beneficiary_first_name: String,
    /// Beneficiary first relationship.
    pub beneficiary_first_relationship: String,
    /// Beneficiary first share percent.
    #[validate(range(min = -999.99, max = 999.99))]
    pub beneficiary_first_share_percent: Option<f64>,
    /// Beneficiary first is minor.
    pub beneficiary_first_is_minor: String,
    /// Beneficiary first has trustee.
    pub beneficiary_first_has_trustee: String,
    /// Beneficiary second name.
    #[validate(length(max = TEXT_MAX))]
    pub beneficiary_second_name: String,
    /// Beneficiary second relationship.
    pub beneficiary_second_relationship: String,
    /// Beneficiary second share percent.
    #[validate(range(min = -999.99, max = 999.99))]
    pub beneficiary_second_share_percent: Option<f64>,
    /// Beneficiary second is minor.
    pub beneficiary_second_is_minor: String,
    /// Beneficiary second has trustee.
    pub beneficiary_second_has_trustee: String,
    /// Beneficiary third name.
    #[validate(length(max = TEXT_MAX))]
    pub beneficiary_third_name: String,
    /// Beneficiary third relationship.
    pub beneficiary_third_relationship: String,
    /// Beneficiary third share percent.
    #[validate(range(min = -999.99, max = 999.99))]
    pub beneficiary_third_share_percent: Option<f64>,
    /// Beneficiary third is minor.
    pub beneficiary_third_is_minor: String,
    /// Beneficiary third has trustee.
    pub beneficiary_third_has_trustee: String,
    /// Beneficiary fourth name.
    #[validate(length(max = TEXT_MAX))]
    pub beneficiary_fourth_name: String,
    /// Beneficiary fourth relationship.
    pub beneficiary_fourth_relationship: String,
    /// Beneficiary fourth share percent.
    #[validate(range(min = -999.99, max = 999.99))]
    pub beneficiary_fourth_share_percent: Option<f64>,
    /// Beneficiary fourth is minor.
    pub beneficiary_fourth_is_minor: String,
    /// Beneficiary fourth has trustee.
    pub beneficiary_fourth_has_trustee: String,
    /// Residuary clause.
    pub residuary_clause: String,
    /// Dependants considered.
    pub dependants_considered: String,
    /// Has children under 18.
    pub has_children_under_18: String,
    /// Guardian name.
    #[validate(length(max = TEXT_MAX))]
    pub guardian_name: String,
    /// Funeral wishes.
    pub funeral_wishes: String,
    /// Funeral wishes note.
    #[validate(length(max = TEXT_MAX))]
    pub funeral_wishes_note: String,
    /// Execution status.
    pub execution_status: String,
    /// Date of will.
    #[validate(custom(function = "plausible_date"))]
    pub date_of_will: Option<Date>,
    /// Will in writing.
    pub will_in_writing: String,
    /// Testator signed.
    pub testator_signed: String,
    /// Witnesses present together.
    pub witnesses_present_together: String,
    /// Witnesses signed.
    pub witnesses_signed: String,
    /// Witness first name.
    #[validate(length(max = TEXT_MAX))]
    pub witness_first_name: String,
    /// Witness first over 18.
    pub witness_first_over_18: String,
    /// Witness first is beneficiary or spouse.
    pub witness_first_is_beneficiary_or_spouse: String,
    /// Witness second name.
    #[validate(length(max = TEXT_MAX))]
    pub witness_second_name: String,
    /// Witness second over 18.
    pub witness_second_over_18: String,
    /// Witness second is beneficiary or spouse.
    pub witness_second_is_beneficiary_or_spouse: String,
    /// Drafter note.
    #[validate(length(max = TEXT_MAX))]
    pub drafter_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_last_will_and_testaments (testator_id, \
            testator_name, date_of_birth, testator_address, domicile, marital_status, \
            marriage_expected, contemplation_of_marriage_clause, has_mental_capacity, \
            made_voluntarily, previous_will, revocation_clause, estate_value_band, \
            owns_home, home_to_direct_descendants, charity_gift_percent, \
            estate_other_jurisdictions, other_jurisdictions_detail, \
            specific_gifts_notes, executor_first_name, executor_first_relationship, \
            executor_second_name, executor_second_relationship, \
            executors_adult_confirmed, beneficiary_first_name, \
            beneficiary_first_relationship, beneficiary_first_share_percent, \
            beneficiary_first_is_minor, beneficiary_first_has_trustee, \
            beneficiary_second_name, beneficiary_second_relationship, \
            beneficiary_second_share_percent, beneficiary_second_is_minor, \
            beneficiary_second_has_trustee, beneficiary_third_name, \
            beneficiary_third_relationship, beneficiary_third_share_percent, \
            beneficiary_third_is_minor, beneficiary_third_has_trustee, \
            beneficiary_fourth_name, beneficiary_fourth_relationship, \
            beneficiary_fourth_share_percent, beneficiary_fourth_is_minor, \
            beneficiary_fourth_has_trustee, residuary_clause, dependants_considered, \
            has_children_under_18, guardian_name, funeral_wishes, funeral_wishes_note, \
            execution_status, date_of_will, will_in_writing, testator_signed, \
            witnesses_present_together, witnesses_signed, witness_first_name, \
            witness_first_over_18, witness_first_is_beneficiary_or_spouse, \
            witness_second_name, witness_second_over_18, \
            witness_second_is_beneficiary_or_spouse, drafter_note) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, \
            $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, \
            $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63) \
            RETURNING *",
        )
        .bind(self.testator_id)
        .bind(&self.testator_name)
        .bind(self.date_of_birth)
        .bind(&self.testator_address)
        .bind(&self.domicile)
        .bind(&self.marital_status)
        .bind(&self.marriage_expected)
        .bind(&self.contemplation_of_marriage_clause)
        .bind(&self.has_mental_capacity)
        .bind(&self.made_voluntarily)
        .bind(&self.previous_will)
        .bind(&self.revocation_clause)
        .bind(&self.estate_value_band)
        .bind(&self.owns_home)
        .bind(&self.home_to_direct_descendants)
        .bind(self.charity_gift_percent)
        .bind(&self.estate_other_jurisdictions)
        .bind(&self.other_jurisdictions_detail)
        .bind(&self.specific_gifts_notes)
        .bind(&self.executor_first_name)
        .bind(&self.executor_first_relationship)
        .bind(&self.executor_second_name)
        .bind(&self.executor_second_relationship)
        .bind(&self.executors_adult_confirmed)
        .bind(&self.beneficiary_first_name)
        .bind(&self.beneficiary_first_relationship)
        .bind(self.beneficiary_first_share_percent)
        .bind(&self.beneficiary_first_is_minor)
        .bind(&self.beneficiary_first_has_trustee)
        .bind(&self.beneficiary_second_name)
        .bind(&self.beneficiary_second_relationship)
        .bind(self.beneficiary_second_share_percent)
        .bind(&self.beneficiary_second_is_minor)
        .bind(&self.beneficiary_second_has_trustee)
        .bind(&self.beneficiary_third_name)
        .bind(&self.beneficiary_third_relationship)
        .bind(self.beneficiary_third_share_percent)
        .bind(&self.beneficiary_third_is_minor)
        .bind(&self.beneficiary_third_has_trustee)
        .bind(&self.beneficiary_fourth_name)
        .bind(&self.beneficiary_fourth_relationship)
        .bind(self.beneficiary_fourth_share_percent)
        .bind(&self.beneficiary_fourth_is_minor)
        .bind(&self.beneficiary_fourth_has_trustee)
        .bind(&self.residuary_clause)
        .bind(&self.dependants_considered)
        .bind(&self.has_children_under_18)
        .bind(&self.guardian_name)
        .bind(&self.funeral_wishes)
        .bind(&self.funeral_wishes_note)
        .bind(&self.execution_status)
        .bind(self.date_of_will)
        .bind(&self.will_in_writing)
        .bind(&self.testator_signed)
        .bind(&self.witnesses_present_together)
        .bind(&self.witnesses_signed)
        .bind(&self.witness_first_name)
        .bind(&self.witness_first_over_18)
        .bind(&self.witness_first_is_beneficiary_or_spouse)
        .bind(&self.witness_second_name)
        .bind(&self.witness_second_over_18)
        .bind(&self.witness_second_is_beneficiary_or_spouse)
        .bind(&self.drafter_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_last_will_and_testaments SET testator_id = $2, \
            testator_name = $3, date_of_birth = $4, testator_address = $5, domicile = \
            $6, marital_status = $7, marriage_expected = $8, \
            contemplation_of_marriage_clause = $9, has_mental_capacity = $10, \
            made_voluntarily = $11, previous_will = $12, revocation_clause = $13, \
            estate_value_band = $14, owns_home = $15, home_to_direct_descendants = $16, \
            charity_gift_percent = $17, estate_other_jurisdictions = $18, \
            other_jurisdictions_detail = $19, specific_gifts_notes = $20, \
            executor_first_name = $21, executor_first_relationship = $22, \
            executor_second_name = $23, executor_second_relationship = $24, \
            executors_adult_confirmed = $25, beneficiary_first_name = $26, \
            beneficiary_first_relationship = $27, beneficiary_first_share_percent = $28, \
            beneficiary_first_is_minor = $29, beneficiary_first_has_trustee = $30, \
            beneficiary_second_name = $31, beneficiary_second_relationship = $32, \
            beneficiary_second_share_percent = $33, beneficiary_second_is_minor = $34, \
            beneficiary_second_has_trustee = $35, beneficiary_third_name = $36, \
            beneficiary_third_relationship = $37, beneficiary_third_share_percent = $38, \
            beneficiary_third_is_minor = $39, beneficiary_third_has_trustee = $40, \
            beneficiary_fourth_name = $41, beneficiary_fourth_relationship = $42, \
            beneficiary_fourth_share_percent = $43, beneficiary_fourth_is_minor = $44, \
            beneficiary_fourth_has_trustee = $45, residuary_clause = $46, \
            dependants_considered = $47, has_children_under_18 = $48, guardian_name = \
            $49, funeral_wishes = $50, funeral_wishes_note = $51, execution_status = \
            $52, date_of_will = $53, will_in_writing = $54, testator_signed = $55, \
            witnesses_present_together = $56, witnesses_signed = $57, witness_first_name \
            = $58, witness_first_over_18 = $59, witness_first_is_beneficiary_or_spouse = \
            $60, witness_second_name = $61, witness_second_over_18 = $62, \
            witness_second_is_beneficiary_or_spouse = $63, drafter_note = $64, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.testator_id)
        .bind(&self.testator_name)
        .bind(self.date_of_birth)
        .bind(&self.testator_address)
        .bind(&self.domicile)
        .bind(&self.marital_status)
        .bind(&self.marriage_expected)
        .bind(&self.contemplation_of_marriage_clause)
        .bind(&self.has_mental_capacity)
        .bind(&self.made_voluntarily)
        .bind(&self.previous_will)
        .bind(&self.revocation_clause)
        .bind(&self.estate_value_band)
        .bind(&self.owns_home)
        .bind(&self.home_to_direct_descendants)
        .bind(self.charity_gift_percent)
        .bind(&self.estate_other_jurisdictions)
        .bind(&self.other_jurisdictions_detail)
        .bind(&self.specific_gifts_notes)
        .bind(&self.executor_first_name)
        .bind(&self.executor_first_relationship)
        .bind(&self.executor_second_name)
        .bind(&self.executor_second_relationship)
        .bind(&self.executors_adult_confirmed)
        .bind(&self.beneficiary_first_name)
        .bind(&self.beneficiary_first_relationship)
        .bind(self.beneficiary_first_share_percent)
        .bind(&self.beneficiary_first_is_minor)
        .bind(&self.beneficiary_first_has_trustee)
        .bind(&self.beneficiary_second_name)
        .bind(&self.beneficiary_second_relationship)
        .bind(self.beneficiary_second_share_percent)
        .bind(&self.beneficiary_second_is_minor)
        .bind(&self.beneficiary_second_has_trustee)
        .bind(&self.beneficiary_third_name)
        .bind(&self.beneficiary_third_relationship)
        .bind(self.beneficiary_third_share_percent)
        .bind(&self.beneficiary_third_is_minor)
        .bind(&self.beneficiary_third_has_trustee)
        .bind(&self.beneficiary_fourth_name)
        .bind(&self.beneficiary_fourth_relationship)
        .bind(self.beneficiary_fourth_share_percent)
        .bind(&self.beneficiary_fourth_is_minor)
        .bind(&self.beneficiary_fourth_has_trustee)
        .bind(&self.residuary_clause)
        .bind(&self.dependants_considered)
        .bind(&self.has_children_under_18)
        .bind(&self.guardian_name)
        .bind(&self.funeral_wishes)
        .bind(&self.funeral_wishes_note)
        .bind(&self.execution_status)
        .bind(self.date_of_will)
        .bind(&self.will_in_writing)
        .bind(&self.testator_signed)
        .bind(&self.witnesses_present_together)
        .bind(&self.witnesses_signed)
        .bind(&self.witness_first_name)
        .bind(&self.witness_first_over_18)
        .bind(&self.witness_first_is_beneficiary_or_spouse)
        .bind(&self.witness_second_name)
        .bind(&self.witness_second_over_18)
        .bind(&self.witness_second_is_beneficiary_or_spouse)
        .bind(&self.drafter_note)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
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

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/united-kingdom-last-will-and-testament/united_kingdom_last_will_and_testaments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
