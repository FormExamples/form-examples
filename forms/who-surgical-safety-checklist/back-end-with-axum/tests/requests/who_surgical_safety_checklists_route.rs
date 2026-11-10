use axa_test::prelude::*;
use serial_test::serial;
use who_surgical_safety_checklist::app::App;

#[tokio::test]
#[serial]
async fn can_get_who_surgical_safety_checklists() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/who_surgical_safety_checklists").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
