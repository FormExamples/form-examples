#[allow(unused_imports)]
use crate::{db, seed};
use axa::testing::prelude::*;
use outpatient_outcome::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_outpatient_outcome_prom_eq5d5ls() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/outpatient_outcome_prom_eq5d5ls").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}

/// The EQ-5D-5L answers are stored and read back, and an answer outside 1 to 5
/// is refused, as `sql/` refuses it.
#[tokio::test]
#[serial]
async fn the_answers_are_kept() {
    request::<App, _, _>(|request, ctx| async move {
        seed::<App>(&ctx).await.unwrap();
        let outcome: uuid::Uuid = sqlx::query_scalar("SELECT id FROM outpatient_outcomes LIMIT 1")
            .fetch_one(&db(&ctx))
            .await
            .unwrap();
        let answers = serde_json::json!({
            "outpatientOutcomeId": outcome,
            "beforeMobility": 3, "beforeSelfCare": 2, "beforeUsualActivities": 3,
            "beforePainDiscomfort": 4, "beforeAnxietyDepression": 2, "beforeVas": 55,
            "afterMobility": 2, "afterSelfCare": 1, "afterUsualActivities": 2,
            "afterPainDiscomfort": 2, "afterAnxietyDepression": 1, "afterVas": 80
        });
        let res = request
            .post("/api/outpatient_outcome_prom_eq5d5ls")
            .json(&answers)
            .await;
        assert_eq!(res.status_code(), 200, "{}", res.text());
        let id = res.json::<serde_json::Value>()["id"]
            .as_str()
            .unwrap()
            .to_owned();
        let read: serde_json::Value = request
            .get(&format!("/api/outpatient_outcome_prom_eq5d5ls/{id}"))
            .await
            .json();
        for (key, value) in answers.as_object().unwrap() {
            assert_eq!(&read[key], value, "{key}");
        }

        let mut refused = answers.clone();
        refused["beforeMobility"] = 6.into();
        let res = request
            .post("/api/outpatient_outcome_prom_eq5d5ls")
            .json(&refused)
            .await;
        assert_eq!(res.status_code(), 422, "{}", res.text());
    })
    .await;
}
