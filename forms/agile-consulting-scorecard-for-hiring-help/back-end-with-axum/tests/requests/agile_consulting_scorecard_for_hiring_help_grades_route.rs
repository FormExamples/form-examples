use agile_consulting_scorecard_for_hiring_help::app::App;
use axa::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_agile_consulting_scorecard_for_hiring_help_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request
            .get("/api/agile_consulting_scorecard_for_hiring_help_grades")
            .await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
