use fluid_balance_chart::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_fluid_balance_chart_grade_flags() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/fluid_balance_chart_grade_flags/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
