use axa_test::prelude::*;
use united_kingdom_vehicle_bill_of_sale::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_buyers() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/united-kingdom-vehicle-bill-of-sale/buyers").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
