#[allow(unused_imports)]
use crate::{db, seed};
use axa_test::prelude::*;
use united_states_vehicle_title_and_registration_application::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn seeds_vehicle_title_application_grade_rules() {
    let boot = boot_test::<App>().await.unwrap();
    seed::<App>(&boot.app_context).await.unwrap();
    let count: i64 = sqlx::query_scalar("SELECT count(*) FROM vehicle_title_application_grade_rules WHERE deleted_at IS NULL")
        .fetch_one(&db(&boot.app_context))
        .await
        .unwrap();
    assert!(count >= 1, "the fixture left vehicle_title_application_grade_rules empty");
}
