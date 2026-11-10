#[allow(unused_imports)]
use crate::{db, seed};
use arc42::app::App;
use axa_test::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_arc42_documentations() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/arc42_documentations").await;
        assert_eq!(res.status_code(), 200);

        // you can assert content like this:
        // assert_eq!(res.text(), "content");
    })
    .await;
}
