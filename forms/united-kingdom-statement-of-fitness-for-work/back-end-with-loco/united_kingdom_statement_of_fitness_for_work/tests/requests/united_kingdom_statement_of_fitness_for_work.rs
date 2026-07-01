use united_kingdom_statement_of_fitness_for_work::app::App;
use loco_rs::testing::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_united_kingdom_statement_of_fitness_for_works() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/united_kingdom_statement_of_fitness_for_works/").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
