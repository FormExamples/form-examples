#[allow(unused_imports)]
use crate::{db, seed};
use axa_test::prelude::*;
use patient_reported_outcome_measures::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_patient_reported_outcome_measures_scores() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request
            .get("/api/patient_reported_outcome_measures_scores")
            .await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
