//! Patient reported outcome measures module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::patient_reported_outcome_measures::{ActiveModel, Entity, Model};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Deleted at.
    pub deleted_at: Option<DateTimeWithTimeZone>,
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
    fn update(&self, item: &mut ActiveModel) {
      item.deleted_at = Set(self.deleted_at);
      item.subject_id = Set(self.subject_id.clone());
      item.visit = Set(self.visit.clone());
      item.assessment_date = Set(self.assessment_date);
      item.general_health = Set(self.general_health);
      item.health_change_vs_year_ago = Set(self.health_change_vs_year_ago);
      item.vigorous_activities = Set(self.vigorous_activities);
      item.moderate_activities = Set(self.moderate_activities);
      item.lifting_carrying_groceries = Set(self.lifting_carrying_groceries);
      item.climbing_several_flights = Set(self.climbing_several_flights);
      item.climbing_one_flight = Set(self.climbing_one_flight);
      item.bending_kneeling_stooping = Set(self.bending_kneeling_stooping);
      item.walking_more_than_mile = Set(self.walking_more_than_mile);
      item.walking_several_hundred_yards = Set(self.walking_several_hundred_yards);
      item.walking_one_hundred_yards = Set(self.walking_one_hundred_yards);
      item.bathing_dressing = Set(self.bathing_dressing);
      item.cut_down_time_physical = Set(self.cut_down_time_physical);
      item.accomplished_less_physical = Set(self.accomplished_less_physical);
      item.limited_in_kind_physical = Set(self.limited_in_kind_physical);
      item.difficulty_performing_physical = Set(self.difficulty_performing_physical);
      item.cut_down_time_emotional = Set(self.cut_down_time_emotional);
      item.accomplished_less_emotional = Set(self.accomplished_less_emotional);
      item.less_careful_than_usual = Set(self.less_careful_than_usual);
      item.social_activities_interference = Set(self.social_activities_interference);
      item.bodily_pain = Set(self.bodily_pain);
      item.pain_interference_with_work = Set(self.pain_interference_with_work);
      item.felt_full_of_life = Set(self.felt_full_of_life);
      item.very_nervous = Set(self.very_nervous);
      item.so_down_in_dumps = Set(self.so_down_in_dumps);
      item.felt_calm_peaceful = Set(self.felt_calm_peaceful);
      item.lot_of_energy = Set(self.lot_of_energy);
      item.downhearted_depressed = Set(self.downhearted_depressed);
      item.felt_worn_out = Set(self.felt_worn_out);
      item.been_happy = Set(self.been_happy);
      item.felt_tired = Set(self.felt_tired);
      item.social_activities_interference_time = Set(self.social_activities_interference_time);
      item.get_sick_easier = Set(self.get_sick_easier);
      item.as_healthy_as_anybody = Set(self.as_healthy_as_anybody);
      item.expect_health_worse = Set(self.expect_health_worse);
      item.health_excellent = Set(self.health_excellent);
      item.ndi_pain_intensity = Set(self.ndi_pain_intensity);
      item.ndi_personal_care = Set(self.ndi_personal_care);
      item.ndi_lifting = Set(self.ndi_lifting);
      item.ndi_reading = Set(self.ndi_reading);
      item.ndi_headache = Set(self.ndi_headache);
      item.ndi_concentration = Set(self.ndi_concentration);
      item.ndi_work = Set(self.ndi_work);
      item.ndi_driving = Set(self.ndi_driving);
      item.ndi_sleeping = Set(self.ndi_sleeping);
      item.ndi_recreation = Set(self.ndi_recreation);
      item.mjoa_motor_arms = Set(self.mjoa_motor_arms);
      item.mjoa_motor_legs = Set(self.mjoa_motor_legs);
      item.mjoa_sensation_arms = Set(self.mjoa_sensation_arms);
      item.mjoa_sensation_legs = Set(self.mjoa_sensation_legs);
      item.mjoa_sensation_trunk = Set(self.mjoa_sensation_trunk);
      item.mjoa_bladder_function = Set(self.mjoa_bladder_function);
      item.eq5d_mobility = Set(self.eq5d_mobility);
      item.eq5d_self_care = Set(self.eq5d_self_care);
      item.eq5d_usual_activities = Set(self.eq5d_usual_activities);
      item.eq5d_pain_discomfort = Set(self.eq5d_pain_discomfort);
      item.eq5d_anxiety_depression = Set(self.eq5d_anxiety_depression);
      item.eq5d_vas_score = Set(self.eq5d_vas_score);
      }
}

async fn load_item(ctx: &AppContext, id: i64) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    format::json(Entity::find().all(&ctx.db).await?)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<i64>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let item = item.update(&ctx.db).await?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<i64>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<i64>, State(ctx): State<AppContext>) -> Result<Response> {
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
