use arc42::app::App;
use axa_test::prelude::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_glossary_terms() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/glossary_terms").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
