#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub status: String,
    pub full_name: String,
    pub address: String,
    pub postcode: String,
    pub date_of_birth: Option<Date>,
    pub nhs_number: String,
    pub phone: String,
    pub email: String,
    pub gp_name: String,
    pub gp_practice: String,
    pub reason_for_statement: String,
    pub current_health_status: String,
    pub current_diagnoses: String,
    pub has_discussed_with_family: String,
    pub has_discussed_with_clinician: String,
    pub discussion_details: String,
    pub personal_values: String,
    pub quality_of_life_priorities: String,
    pub religious_beliefs: String,
    pub spiritual_needs: String,
    pub cultural_considerations: String,
    pub fears_and_concerns: String,
    pub things_that_matter_most: String,
    pub preferred_place_of_care: String,
    pub preferred_place_of_death: String,
    pub daily_routine_preferences: String,
    pub personal_care_preferences: String,
    pub food_and_drink_preferences: String,
    pub sleep_preferences: String,
    pub clothing_preferences: String,
    pub environment_preferences: String,
    pub pet_care_wishes: String,
    pub pain_management_preferences: String,
    pub attitude_to_hospital_admission: String,
    pub attitude_to_intensive_care: String,
    pub attitude_to_artificial_nutrition: String,
    pub attitude_to_artificial_hydration: String,
    pub medication_preferences: String,
    pub complementary_therapy_preferences: String,
    pub other_treatment_wishes: String,
    pub preferred_language: String,
    pub communication_aids: String,
    pub how_to_share_information: String,
    pub who_to_involve_in_decisions: String,
    pub information_sharing_restrictions: String,
    pub preferred_communication_style: String,
    pub primary_contact_name: String,
    pub primary_contact_relationship: String,
    pub primary_contact_phone: String,
    pub primary_contact_email: String,
    pub secondary_contact_name: String,
    pub secondary_contact_relationship: String,
    pub secondary_contact_phone: String,
    pub people_who_should_visit: String,
    pub people_who_should_not_visit: String,
    pub support_network_details: String,
    pub financial_arrangements: String,
    pub property_arrangements: String,
    pub insurance_details: String,
    pub will_location: String,
    pub has_lasting_power_of_attorney: String,
    pub lpa_details: String,
    pub funeral_wishes: String,
    pub burial_or_cremation: String,
    pub other_practical_matters: String,
    pub maker_signature_obtained: String,
    pub maker_signature_date: Option<Date>,
    pub witness_name: String,
    pub witness_address: String,
    pub witness_signature_obtained: String,
    pub witness_signature_date: Option<Date>,
    pub review_date: Option<Date>,
    pub review_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessments (patient_id, status, full_name, address, postcode, \
            date_of_birth, nhs_number, phone, email, gp_name, gp_practice, \
            reason_for_statement, current_health_status, current_diagnoses, \
            has_discussed_with_family, has_discussed_with_clinician, discussion_details, \
            personal_values, quality_of_life_priorities, religious_beliefs, \
            spiritual_needs, cultural_considerations, fears_and_concerns, \
            things_that_matter_most, preferred_place_of_care, preferred_place_of_death, \
            daily_routine_preferences, personal_care_preferences, \
            food_and_drink_preferences, sleep_preferences, clothing_preferences, \
            environment_preferences, pet_care_wishes, pain_management_preferences, \
            attitude_to_hospital_admission, attitude_to_intensive_care, \
            attitude_to_artificial_nutrition, attitude_to_artificial_hydration, \
            medication_preferences, complementary_therapy_preferences, \
            other_treatment_wishes, preferred_language, communication_aids, \
            how_to_share_information, who_to_involve_in_decisions, \
            information_sharing_restrictions, preferred_communication_style, \
            primary_contact_name, primary_contact_relationship, primary_contact_phone, \
            primary_contact_email, secondary_contact_name, \
            secondary_contact_relationship, secondary_contact_phone, \
            people_who_should_visit, people_who_should_not_visit, \
            support_network_details, financial_arrangements, property_arrangements, \
            insurance_details, will_location, has_lasting_power_of_attorney, \
            lpa_details, funeral_wishes, burial_or_cremation, other_practical_matters, \
            maker_signature_obtained, maker_signature_date, witness_name, \
            witness_address, witness_signature_obtained, witness_signature_date, \
            review_date, review_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, \
            $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, \
            $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, \
            $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, \
            $71, $72, $73, $74) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(&self.status)
        .bind(&self.full_name)
        .bind(&self.address)
        .bind(&self.postcode)
        .bind(self.date_of_birth)
        .bind(&self.nhs_number)
        .bind(&self.phone)
        .bind(&self.email)
        .bind(&self.gp_name)
        .bind(&self.gp_practice)
        .bind(&self.reason_for_statement)
        .bind(&self.current_health_status)
        .bind(&self.current_diagnoses)
        .bind(&self.has_discussed_with_family)
        .bind(&self.has_discussed_with_clinician)
        .bind(&self.discussion_details)
        .bind(&self.personal_values)
        .bind(&self.quality_of_life_priorities)
        .bind(&self.religious_beliefs)
        .bind(&self.spiritual_needs)
        .bind(&self.cultural_considerations)
        .bind(&self.fears_and_concerns)
        .bind(&self.things_that_matter_most)
        .bind(&self.preferred_place_of_care)
        .bind(&self.preferred_place_of_death)
        .bind(&self.daily_routine_preferences)
        .bind(&self.personal_care_preferences)
        .bind(&self.food_and_drink_preferences)
        .bind(&self.sleep_preferences)
        .bind(&self.clothing_preferences)
        .bind(&self.environment_preferences)
        .bind(&self.pet_care_wishes)
        .bind(&self.pain_management_preferences)
        .bind(&self.attitude_to_hospital_admission)
        .bind(&self.attitude_to_intensive_care)
        .bind(&self.attitude_to_artificial_nutrition)
        .bind(&self.attitude_to_artificial_hydration)
        .bind(&self.medication_preferences)
        .bind(&self.complementary_therapy_preferences)
        .bind(&self.other_treatment_wishes)
        .bind(&self.preferred_language)
        .bind(&self.communication_aids)
        .bind(&self.how_to_share_information)
        .bind(&self.who_to_involve_in_decisions)
        .bind(&self.information_sharing_restrictions)
        .bind(&self.preferred_communication_style)
        .bind(&self.primary_contact_name)
        .bind(&self.primary_contact_relationship)
        .bind(&self.primary_contact_phone)
        .bind(&self.primary_contact_email)
        .bind(&self.secondary_contact_name)
        .bind(&self.secondary_contact_relationship)
        .bind(&self.secondary_contact_phone)
        .bind(&self.people_who_should_visit)
        .bind(&self.people_who_should_not_visit)
        .bind(&self.support_network_details)
        .bind(&self.financial_arrangements)
        .bind(&self.property_arrangements)
        .bind(&self.insurance_details)
        .bind(&self.will_location)
        .bind(&self.has_lasting_power_of_attorney)
        .bind(&self.lpa_details)
        .bind(&self.funeral_wishes)
        .bind(&self.burial_or_cremation)
        .bind(&self.other_practical_matters)
        .bind(&self.maker_signature_obtained)
        .bind(self.maker_signature_date)
        .bind(&self.witness_name)
        .bind(&self.witness_address)
        .bind(&self.witness_signature_obtained)
        .bind(self.witness_signature_date)
        .bind(self.review_date)
        .bind(&self.review_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessments SET patient_id = $2, status = $3, full_name = $4, address \
            = $5, postcode = $6, date_of_birth = $7, nhs_number = $8, phone = $9, email \
            = $10, gp_name = $11, gp_practice = $12, reason_for_statement = $13, \
            current_health_status = $14, current_diagnoses = $15, \
            has_discussed_with_family = $16, has_discussed_with_clinician = $17, \
            discussion_details = $18, personal_values = $19, quality_of_life_priorities \
            = $20, religious_beliefs = $21, spiritual_needs = $22, \
            cultural_considerations = $23, fears_and_concerns = $24, \
            things_that_matter_most = $25, preferred_place_of_care = $26, \
            preferred_place_of_death = $27, daily_routine_preferences = $28, \
            personal_care_preferences = $29, food_and_drink_preferences = $30, \
            sleep_preferences = $31, clothing_preferences = $32, environment_preferences \
            = $33, pet_care_wishes = $34, pain_management_preferences = $35, \
            attitude_to_hospital_admission = $36, attitude_to_intensive_care = $37, \
            attitude_to_artificial_nutrition = $38, attitude_to_artificial_hydration = \
            $39, medication_preferences = $40, complementary_therapy_preferences = $41, \
            other_treatment_wishes = $42, preferred_language = $43, communication_aids = \
            $44, how_to_share_information = $45, who_to_involve_in_decisions = $46, \
            information_sharing_restrictions = $47, preferred_communication_style = $48, \
            primary_contact_name = $49, primary_contact_relationship = $50, \
            primary_contact_phone = $51, primary_contact_email = $52, \
            secondary_contact_name = $53, secondary_contact_relationship = $54, \
            secondary_contact_phone = $55, people_who_should_visit = $56, \
            people_who_should_not_visit = $57, support_network_details = $58, \
            financial_arrangements = $59, property_arrangements = $60, insurance_details \
            = $61, will_location = $62, has_lasting_power_of_attorney = $63, lpa_details \
            = $64, funeral_wishes = $65, burial_or_cremation = $66, \
            other_practical_matters = $67, maker_signature_obtained = $68, \
            maker_signature_date = $69, witness_name = $70, witness_address = $71, \
            witness_signature_obtained = $72, witness_signature_date = $73, review_date \
            = $74, review_notes = $75, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(&self.status)
        .bind(&self.full_name)
        .bind(&self.address)
        .bind(&self.postcode)
        .bind(self.date_of_birth)
        .bind(&self.nhs_number)
        .bind(&self.phone)
        .bind(&self.email)
        .bind(&self.gp_name)
        .bind(&self.gp_practice)
        .bind(&self.reason_for_statement)
        .bind(&self.current_health_status)
        .bind(&self.current_diagnoses)
        .bind(&self.has_discussed_with_family)
        .bind(&self.has_discussed_with_clinician)
        .bind(&self.discussion_details)
        .bind(&self.personal_values)
        .bind(&self.quality_of_life_priorities)
        .bind(&self.religious_beliefs)
        .bind(&self.spiritual_needs)
        .bind(&self.cultural_considerations)
        .bind(&self.fears_and_concerns)
        .bind(&self.things_that_matter_most)
        .bind(&self.preferred_place_of_care)
        .bind(&self.preferred_place_of_death)
        .bind(&self.daily_routine_preferences)
        .bind(&self.personal_care_preferences)
        .bind(&self.food_and_drink_preferences)
        .bind(&self.sleep_preferences)
        .bind(&self.clothing_preferences)
        .bind(&self.environment_preferences)
        .bind(&self.pet_care_wishes)
        .bind(&self.pain_management_preferences)
        .bind(&self.attitude_to_hospital_admission)
        .bind(&self.attitude_to_intensive_care)
        .bind(&self.attitude_to_artificial_nutrition)
        .bind(&self.attitude_to_artificial_hydration)
        .bind(&self.medication_preferences)
        .bind(&self.complementary_therapy_preferences)
        .bind(&self.other_treatment_wishes)
        .bind(&self.preferred_language)
        .bind(&self.communication_aids)
        .bind(&self.how_to_share_information)
        .bind(&self.who_to_involve_in_decisions)
        .bind(&self.information_sharing_restrictions)
        .bind(&self.preferred_communication_style)
        .bind(&self.primary_contact_name)
        .bind(&self.primary_contact_relationship)
        .bind(&self.primary_contact_phone)
        .bind(&self.primary_contact_email)
        .bind(&self.secondary_contact_name)
        .bind(&self.secondary_contact_relationship)
        .bind(&self.secondary_contact_phone)
        .bind(&self.people_who_should_visit)
        .bind(&self.people_who_should_not_visit)
        .bind(&self.support_network_details)
        .bind(&self.financial_arrangements)
        .bind(&self.property_arrangements)
        .bind(&self.insurance_details)
        .bind(&self.will_location)
        .bind(&self.has_lasting_power_of_attorney)
        .bind(&self.lpa_details)
        .bind(&self.funeral_wishes)
        .bind(&self.burial_or_cremation)
        .bind(&self.other_practical_matters)
        .bind(&self.maker_signature_obtained)
        .bind(self.maker_signature_date)
        .bind(&self.witness_name)
        .bind(&self.witness_address)
        .bind(&self.witness_signature_obtained)
        .bind(self.witness_signature_date)
        .bind(self.review_date)
        .bind(&self.review_notes)
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
        .prefix("api/assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
