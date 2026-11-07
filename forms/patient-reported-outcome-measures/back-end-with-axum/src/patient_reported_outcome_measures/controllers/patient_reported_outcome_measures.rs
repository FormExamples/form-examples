//! Patient reported outcome measures module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::patient_reported_outcome_measures::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Subject ID.
    pub subject_id: String,
    /// Visit.
    pub visit: String,
    /// Assessment date.
    pub assessment_date: Option<Date>,
    /// General health.
    pub general_health: Option<i32>,
    /// Health change vs year ago.
    pub health_change_vs_year_ago: Option<i32>,
    /// Vigorous activities.
    pub vigorous_activities: Option<i32>,
    /// Moderate activities.
    pub moderate_activities: Option<i32>,
    /// Lifting carrying groceries.
    pub lifting_carrying_groceries: Option<i32>,
    /// Climbing several flights.
    pub climbing_several_flights: Option<i32>,
    /// Climbing one flight.
    pub climbing_one_flight: Option<i32>,
    /// Bending kneeling stooping.
    pub bending_kneeling_stooping: Option<i32>,
    /// Walking more than mile.
    pub walking_more_than_mile: Option<i32>,
    /// Walking several hundred yards.
    pub walking_several_hundred_yards: Option<i32>,
    /// Walking one hundred yards.
    pub walking_one_hundred_yards: Option<i32>,
    /// Bathing dressing.
    pub bathing_dressing: Option<i32>,
    /// Cut down time physical.
    pub cut_down_time_physical: Option<i32>,
    /// Accomplished less physical.
    pub accomplished_less_physical: Option<i32>,
    /// Limited in kind physical.
    pub limited_in_kind_physical: Option<i32>,
    /// Difficulty performing physical.
    pub difficulty_performing_physical: Option<i32>,
    /// Cut down time emotional.
    pub cut_down_time_emotional: Option<i32>,
    /// Accomplished less emotional.
    pub accomplished_less_emotional: Option<i32>,
    /// Less careful than usual.
    pub less_careful_than_usual: Option<i32>,
    /// Social activities interference.
    pub social_activities_interference: Option<i32>,
    /// Bodily pain.
    pub bodily_pain: Option<i32>,
    /// Pain interference with work.
    pub pain_interference_with_work: Option<i32>,
    /// Felt full of life.
    pub felt_full_of_life: Option<i32>,
    /// Very nervous.
    pub very_nervous: Option<i32>,
    /// So down in dumps.
    pub so_down_in_dumps: Option<i32>,
    /// Felt calm peaceful.
    pub felt_calm_peaceful: Option<i32>,
    /// Lot of energy.
    pub lot_of_energy: Option<i32>,
    /// Downhearted depressed.
    pub downhearted_depressed: Option<i32>,
    /// Felt worn out.
    pub felt_worn_out: Option<i32>,
    /// Been happy.
    pub been_happy: Option<i32>,
    /// Felt tired.
    pub felt_tired: Option<i32>,
    /// Social activities interference time.
    pub social_activities_interference_time: Option<i32>,
    /// Get sick easier.
    pub get_sick_easier: Option<i32>,
    /// As healthy as anybody.
    pub as_healthy_as_anybody: Option<i32>,
    /// Expect health worse.
    pub expect_health_worse: Option<i32>,
    /// Health excellent.
    pub health_excellent: Option<i32>,
    /// Ndi pain intensity.
    pub ndi_pain_intensity: Option<i32>,
    /// Ndi personal care.
    pub ndi_personal_care: Option<i32>,
    /// Ndi lifting.
    pub ndi_lifting: Option<i32>,
    /// Ndi reading.
    pub ndi_reading: Option<i32>,
    /// Ndi headache.
    pub ndi_headache: Option<i32>,
    /// Ndi concentration.
    pub ndi_concentration: Option<i32>,
    /// Ndi work.
    pub ndi_work: Option<i32>,
    /// Ndi driving.
    pub ndi_driving: Option<i32>,
    /// Ndi sleeping.
    pub ndi_sleeping: Option<i32>,
    /// Ndi recreation.
    pub ndi_recreation: Option<i32>,
    /// Mjoa motor arms.
    pub mjoa_motor_arms: Option<i32>,
    /// Mjoa motor legs.
    pub mjoa_motor_legs: Option<i32>,
    /// Mjoa sensation arms.
    pub mjoa_sensation_arms: Option<i32>,
    /// Mjoa sensation legs.
    pub mjoa_sensation_legs: Option<i32>,
    /// Mjoa sensation trunk.
    pub mjoa_sensation_trunk: Option<i32>,
    /// Mjoa bladder function.
    pub mjoa_bladder_function: Option<i32>,
    /// Eq5d mobility.
    pub eq5d_mobility: Option<i32>,
    /// Eq5d self care.
    pub eq5d_self_care: Option<i32>,
    /// Eq5d usual activities.
    pub eq5d_usual_activities: Option<i32>,
    /// Eq5d pain discomfort.
    pub eq5d_pain_discomfort: Option<i32>,
    /// Eq5d anxiety depression.
    pub eq5d_anxiety_depression: Option<i32>,
    /// Eq5d vas score.
    pub eq5d_vas_score: Option<f64>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO patient_reported_outcome_measures (subject_id, visit, \
            assessment_date, general_health, health_change_vs_year_ago, \
            vigorous_activities, moderate_activities, lifting_carrying_groceries, \
            climbing_several_flights, climbing_one_flight, bending_kneeling_stooping, \
            walking_more_than_mile, walking_several_hundred_yards, \
            walking_one_hundred_yards, bathing_dressing, cut_down_time_physical, \
            accomplished_less_physical, limited_in_kind_physical, \
            difficulty_performing_physical, cut_down_time_emotional, \
            accomplished_less_emotional, less_careful_than_usual, \
            social_activities_interference, bodily_pain, pain_interference_with_work, \
            felt_full_of_life, very_nervous, so_down_in_dumps, felt_calm_peaceful, \
            lot_of_energy, downhearted_depressed, felt_worn_out, been_happy, felt_tired, \
            social_activities_interference_time, get_sick_easier, as_healthy_as_anybody, \
            expect_health_worse, health_excellent, ndi_pain_intensity, \
            ndi_personal_care, ndi_lifting, ndi_reading, ndi_headache, \
            ndi_concentration, ndi_work, ndi_driving, ndi_sleeping, ndi_recreation, \
            mjoa_motor_arms, mjoa_motor_legs, mjoa_sensation_arms, mjoa_sensation_legs, \
            mjoa_sensation_trunk, mjoa_bladder_function, eq5d_mobility, eq5d_self_care, \
            eq5d_usual_activities, eq5d_pain_discomfort, eq5d_anxiety_depression, \
            eq5d_vas_score) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, \
            $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, \
            $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, \
            $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, \
            $58, $59, $60, $61) RETURNING *",
        )
        .bind(&self.subject_id)
        .bind(&self.visit)
        .bind(self.assessment_date)
        .bind(self.general_health)
        .bind(self.health_change_vs_year_ago)
        .bind(self.vigorous_activities)
        .bind(self.moderate_activities)
        .bind(self.lifting_carrying_groceries)
        .bind(self.climbing_several_flights)
        .bind(self.climbing_one_flight)
        .bind(self.bending_kneeling_stooping)
        .bind(self.walking_more_than_mile)
        .bind(self.walking_several_hundred_yards)
        .bind(self.walking_one_hundred_yards)
        .bind(self.bathing_dressing)
        .bind(self.cut_down_time_physical)
        .bind(self.accomplished_less_physical)
        .bind(self.limited_in_kind_physical)
        .bind(self.difficulty_performing_physical)
        .bind(self.cut_down_time_emotional)
        .bind(self.accomplished_less_emotional)
        .bind(self.less_careful_than_usual)
        .bind(self.social_activities_interference)
        .bind(self.bodily_pain)
        .bind(self.pain_interference_with_work)
        .bind(self.felt_full_of_life)
        .bind(self.very_nervous)
        .bind(self.so_down_in_dumps)
        .bind(self.felt_calm_peaceful)
        .bind(self.lot_of_energy)
        .bind(self.downhearted_depressed)
        .bind(self.felt_worn_out)
        .bind(self.been_happy)
        .bind(self.felt_tired)
        .bind(self.social_activities_interference_time)
        .bind(self.get_sick_easier)
        .bind(self.as_healthy_as_anybody)
        .bind(self.expect_health_worse)
        .bind(self.health_excellent)
        .bind(self.ndi_pain_intensity)
        .bind(self.ndi_personal_care)
        .bind(self.ndi_lifting)
        .bind(self.ndi_reading)
        .bind(self.ndi_headache)
        .bind(self.ndi_concentration)
        .bind(self.ndi_work)
        .bind(self.ndi_driving)
        .bind(self.ndi_sleeping)
        .bind(self.ndi_recreation)
        .bind(self.mjoa_motor_arms)
        .bind(self.mjoa_motor_legs)
        .bind(self.mjoa_sensation_arms)
        .bind(self.mjoa_sensation_legs)
        .bind(self.mjoa_sensation_trunk)
        .bind(self.mjoa_bladder_function)
        .bind(self.eq5d_mobility)
        .bind(self.eq5d_self_care)
        .bind(self.eq5d_usual_activities)
        .bind(self.eq5d_pain_discomfort)
        .bind(self.eq5d_anxiety_depression)
        .bind(self.eq5d_vas_score)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE patient_reported_outcome_measures SET subject_id = $2, visit = $3, \
            assessment_date = $4, general_health = $5, health_change_vs_year_ago = $6, \
            vigorous_activities = $7, moderate_activities = $8, \
            lifting_carrying_groceries = $9, climbing_several_flights = $10, \
            climbing_one_flight = $11, bending_kneeling_stooping = $12, \
            walking_more_than_mile = $13, walking_several_hundred_yards = $14, \
            walking_one_hundred_yards = $15, bathing_dressing = $16, \
            cut_down_time_physical = $17, accomplished_less_physical = $18, \
            limited_in_kind_physical = $19, difficulty_performing_physical = $20, \
            cut_down_time_emotional = $21, accomplished_less_emotional = $22, \
            less_careful_than_usual = $23, social_activities_interference = $24, \
            bodily_pain = $25, pain_interference_with_work = $26, felt_full_of_life = \
            $27, very_nervous = $28, so_down_in_dumps = $29, felt_calm_peaceful = $30, \
            lot_of_energy = $31, downhearted_depressed = $32, felt_worn_out = $33, \
            been_happy = $34, felt_tired = $35, social_activities_interference_time = \
            $36, get_sick_easier = $37, as_healthy_as_anybody = $38, expect_health_worse \
            = $39, health_excellent = $40, ndi_pain_intensity = $41, ndi_personal_care = \
            $42, ndi_lifting = $43, ndi_reading = $44, ndi_headache = $45, \
            ndi_concentration = $46, ndi_work = $47, ndi_driving = $48, ndi_sleeping = \
            $49, ndi_recreation = $50, mjoa_motor_arms = $51, mjoa_motor_legs = $52, \
            mjoa_sensation_arms = $53, mjoa_sensation_legs = $54, mjoa_sensation_trunk = \
            $55, mjoa_bladder_function = $56, eq5d_mobility = $57, eq5d_self_care = $58, \
            eq5d_usual_activities = $59, eq5d_pain_discomfort = $60, \
            eq5d_anxiety_depression = $61, eq5d_vas_score = $62, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.subject_id)
        .bind(&self.visit)
        .bind(self.assessment_date)
        .bind(self.general_health)
        .bind(self.health_change_vs_year_ago)
        .bind(self.vigorous_activities)
        .bind(self.moderate_activities)
        .bind(self.lifting_carrying_groceries)
        .bind(self.climbing_several_flights)
        .bind(self.climbing_one_flight)
        .bind(self.bending_kneeling_stooping)
        .bind(self.walking_more_than_mile)
        .bind(self.walking_several_hundred_yards)
        .bind(self.walking_one_hundred_yards)
        .bind(self.bathing_dressing)
        .bind(self.cut_down_time_physical)
        .bind(self.accomplished_less_physical)
        .bind(self.limited_in_kind_physical)
        .bind(self.difficulty_performing_physical)
        .bind(self.cut_down_time_emotional)
        .bind(self.accomplished_less_emotional)
        .bind(self.less_careful_than_usual)
        .bind(self.social_activities_interference)
        .bind(self.bodily_pain)
        .bind(self.pain_interference_with_work)
        .bind(self.felt_full_of_life)
        .bind(self.very_nervous)
        .bind(self.so_down_in_dumps)
        .bind(self.felt_calm_peaceful)
        .bind(self.lot_of_energy)
        .bind(self.downhearted_depressed)
        .bind(self.felt_worn_out)
        .bind(self.been_happy)
        .bind(self.felt_tired)
        .bind(self.social_activities_interference_time)
        .bind(self.get_sick_easier)
        .bind(self.as_healthy_as_anybody)
        .bind(self.expect_health_worse)
        .bind(self.health_excellent)
        .bind(self.ndi_pain_intensity)
        .bind(self.ndi_personal_care)
        .bind(self.ndi_lifting)
        .bind(self.ndi_reading)
        .bind(self.ndi_headache)
        .bind(self.ndi_concentration)
        .bind(self.ndi_work)
        .bind(self.ndi_driving)
        .bind(self.ndi_sleeping)
        .bind(self.ndi_recreation)
        .bind(self.mjoa_motor_arms)
        .bind(self.mjoa_motor_legs)
        .bind(self.mjoa_sensation_arms)
        .bind(self.mjoa_sensation_legs)
        .bind(self.mjoa_sensation_trunk)
        .bind(self.mjoa_bladder_function)
        .bind(self.eq5d_mobility)
        .bind(self.eq5d_self_care)
        .bind(self.eq5d_usual_activities)
        .bind(self.eq5d_pain_discomfort)
        .bind(self.eq5d_anxiety_depression)
        .bind(self.eq5d_vas_score)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
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
        .prefix("api/patient_reported_outcome_measures/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
