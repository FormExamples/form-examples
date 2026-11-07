use arc42::app::App;
use axa::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_arc42_documentation_grade_flags() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/arc42_documentation_grade_flags").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
