use axa::testing::prelude::*;
use serial_test::serial;
use who_surgical_safety_checklist::app::App;

#[tokio::test]
#[serial]
async fn can_get_team_members() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/team_members").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
