use medical_fit_note::app::App;
use loco_rs::testing::prelude::*;
use serde_json::Value;
use serial_test::serial;

/// POST-then-GET round-trip against the scaffold `employee` controller.
///
/// `employee` is the root (person) table of this form. The test creates a
/// record over HTTP, reads it back by id, asserts the fields round-trip, and
/// checks the record appears in the list endpoint. The request body and
/// asserted response keys are camelCase, matching
/// `#[serde(rename_all = "camelCase")]` on the `Params` and `Model` structs.
#[tokio::test]
#[serial]
async fn can_create_and_read_back_employee() {
    request::<App, _, _>(|request, _ctx| async move {
        let new_employee = serde_json::json!({
            "name": "Test Employee",
            "birthDate": "1985-06-15",
            "email": "test.employee@example.com",
            "phone": "+441234567890",
            "postalAddressAsFullText": "10 Downing Street, London",
            "countryAsIso31661Alpha2": "GB",
            "postcode": "SW1A 2AA",
            "unitedKingdomNhsNumber": "9434765919",
            "employerName": "Example Employer Ltd",
            "jobTitle": "Warehouse Operative"
        });

        // 1. CREATE over HTTP.
        let create_res = request.post("/api/employees").json(&new_employee).await;
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

        // 2. READ back by id over HTTP.
        let get_res = request.get(&format!("/api/employees/{id}")).await;
        assert_eq!(
            get_res.status_code(),
            200,
            "get-by-id should succeed, got body: {}",
            get_res.text()
        );

        let fetched: Value = get_res.json();

        // 3. Round-trip: the fetched record echoes exactly what we sent.
        assert_eq!(fetched["id"].as_str(), Some(id.as_str()));
        assert_eq!(fetched["name"], "Test Employee");
        assert_eq!(fetched["birthDate"], "1985-06-15");
        assert_eq!(fetched["email"], "test.employee@example.com");
        assert_eq!(fetched["phone"], "+441234567890");
        assert_eq!(fetched["postalAddressAsFullText"], "10 Downing Street, London");
        assert_eq!(fetched["countryAsIso31661Alpha2"], "GB");
        assert_eq!(fetched["postcode"], "SW1A 2AA");
        assert_eq!(fetched["unitedKingdomNhsNumber"], "9434765919");
        assert_eq!(fetched["employerName"], "Example Employer Ltd");
        assert_eq!(fetched["jobTitle"], "Warehouse Operative");

        // 4. The new record is present in the list endpoint.
        let list_res = request.get("/api/employees").await;
        assert_eq!(list_res.status_code(), 200);
        let list: Value = list_res.json();
        let items = list.as_array().expect("list should be a JSON array");
        assert!(
            items
                .iter()
                .any(|row| row.get("id").and_then(Value::as_str) == Some(id.as_str())),
            "the created employee (id {id}) should appear in the list"
        );
    })
    .await;
}
