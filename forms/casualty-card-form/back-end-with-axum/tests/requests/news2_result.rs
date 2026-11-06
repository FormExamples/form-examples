#[allow(unused_imports)]
use crate::{db, seed};
use axa::testing::prelude::*;
use casualty_card_form::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_news2_results() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/news2_results").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
