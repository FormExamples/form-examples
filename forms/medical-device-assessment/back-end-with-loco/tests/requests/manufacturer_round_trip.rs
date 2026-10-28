use medical_device_assessment::app::App;
use loco_rs::testing::prelude::*;
use serde_json::Value;
use serial_test::serial;

/// POST-then-GET round-trip against the scaffold `manufacturer` controller.
///
/// `manufacturer` is this form's root table (it has no foreign keys). Create a
/// record over HTTP, read it back by id, and assert the fields round-trip with
/// camelCase keys, matching `#[serde(rename_all = "camelCase")]` on the
/// `Params` and `Model` structs.
#[tokio::test]
#[serial]
async fn can_create_and_read_back_manufacturer() {
    request::<App, _, _>(|request, _ctx| async move {
        let new_manufacturer = serde_json::json!({
            "name": "Acme Medical Devices Ltd",
            "email": "regulatory@acme-medical.example.com",
            "phone": "+441234567890",
            "postalAddressAsFullText": "1 Device Way, London",
            "countryAsIso31661Alpha2": "GB",
            "postcode": "SW1A 2AA",
            "singleRegistrationNumber": "GB-MF-000123",
            "authorizedRepresentativeName": "Jane Representative",
            "unitedKingdomResponsiblePersonName": "John Responsible"
        });

        // 1. CREATE over HTTP.
        let create_res = request.post("/api/manufacturers").json(&new_manufacturer).await;
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
        let get_res = request.get(&format!("/api/manufacturers/{id}")).await;
        assert_eq!(
            get_res.status_code(),
            200,
            "get-by-id should succeed, got body: {}",
            get_res.text()
        );
        let fetched: Value = get_res.json();

        // 3. Round-trip: the fetched record echoes exactly what we sent.
        assert_eq!(fetched["id"].as_str(), Some(id.as_str()));
        for (key, value) in new_manufacturer.as_object().unwrap() {
            assert_eq!(&fetched[key], value, "field {key} should round-trip");
        }

        // 4. The new record is present in the list endpoint.
        let list_res = request.get("/api/manufacturers").await;
        assert_eq!(list_res.status_code(), 200);
        let list: Value = list_res.json();
        let items = list.as_array().expect("list should be a JSON array");
        assert!(
            items
                .iter()
                .any(|row| row.get("id").and_then(Value::as_str) == Some(id.as_str())),
            "the created manufacturer (id {id}) should appear in the list"
        );
    })
    .await;
}
