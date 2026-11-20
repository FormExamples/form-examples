use axa_test::prelude::*;
use united_states_divorce_petition::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_united_states_divorce_petition_grade_rules() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/united_states_divorce_petition_grade_rules").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
