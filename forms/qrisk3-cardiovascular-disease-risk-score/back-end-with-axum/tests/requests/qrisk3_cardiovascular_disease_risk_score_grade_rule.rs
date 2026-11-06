#[allow(unused_imports)]
use crate::{db, seed};
use axa::testing::prelude::*;
use qrisk3_cardiovascular_disease_risk_score::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_qrisk3_cardiovascular_disease_risk_score_grade_rules() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request
            .get("/api/qrisk3_cardiovascular_disease_risk_score_grade_rules")
            .await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
