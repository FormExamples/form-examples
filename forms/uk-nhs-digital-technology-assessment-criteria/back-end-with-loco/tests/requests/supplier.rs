// Hand-authored (no `patient` table in this form, so bin/loco-integration-test-rollout skips it):
// the `supplier` table plays the same role as `patient` in the fleet's reference test.
use loco_rs::testing::prelude::*;
use serde_json::Value;
use serial_test::serial;
use uk_nhs_digital_technology_assessment_criteria::app::App;

/// POST-then-GET round-trip against the scaffold `supplier` controller.
///
/// Creates a record over HTTP, reads it back by id, asserts the camelCase
/// fields round-trip, and checks the record appears in the list endpoint.
#[tokio::test]
#[serial]
async fn can_create_and_read_back_supplier() {
    request::<App, _, _>(|request, _ctx| async move {
        let new_supplier = serde_json::json!({
            "name": "Test Supplier Ltd",
            "tradingName": "Test Supplier",
            "companyRegistrationNumber": "01234567",
            "countryOfRegistrationAsIso31661Alpha2": "GB",
            "icoRegistrationNumber": "ZA123456",
            "website": "https://supplier.example.com",
            "postalAddressAsFullText": "1 Example Street, London",
            "postcode": "SW1A 1AA",
            "contactName": "Alex Contact",
            "contactEmail": "alex@supplier.example.com",
            "contactPhone": "+441234567890"
        });

        let create_res = request.post("/api/suppliers").json(&new_supplier).await;
        assert_eq!(
            create_res.status_code(),
            200,
            "create should succeed, got body: {}",
            create_res.text()
        );

        let created: Value = create_res.json();
        let id = created
            .get("id")
            .and_then(Value::as_str)
            .expect("create response should carry a UUID id")
            .to_owned();
        assert!(
            uuid::Uuid::parse_str(&id).is_ok(),
            "id should be a UUID, got {id}"
        );

        let get_res = request.get(&format!("/api/suppliers/{id}")).await;
        assert_eq!(
            get_res.status_code(),
            200,
            "get-by-id should succeed, got body: {}",
            get_res.text()
        );

        let fetched: Value = get_res.json();
        assert_eq!(fetched["id"].as_str(), Some(id.as_str()));
        assert_eq!(fetched["name"], "Test Supplier Ltd");
        assert_eq!(fetched["tradingName"], "Test Supplier");
        assert_eq!(fetched["companyRegistrationNumber"], "01234567");
        assert_eq!(fetched["countryOfRegistrationAsIso31661Alpha2"], "GB");
        assert_eq!(fetched["icoRegistrationNumber"], "ZA123456");
        assert_eq!(fetched["website"], "https://supplier.example.com");
        assert_eq!(
            fetched["postalAddressAsFullText"],
            "1 Example Street, London"
        );
        assert_eq!(fetched["postcode"], "SW1A 1AA");
        assert_eq!(fetched["contactName"], "Alex Contact");
        assert_eq!(fetched["contactEmail"], "alex@supplier.example.com");
        assert_eq!(fetched["contactPhone"], "+441234567890");

        let list_res = request.get("/api/suppliers").await;
        assert_eq!(list_res.status_code(), 200);
        let list: Value = list_res.json();
        let items = list.as_array().expect("list should be a JSON array");
        assert!(
            items
                .iter()
                .any(|row| row.get("id").and_then(Value::as_str) == Some(id.as_str())),
            "the created supplier (id {id}) should appear in the list"
        );
    })
    .await;
}
