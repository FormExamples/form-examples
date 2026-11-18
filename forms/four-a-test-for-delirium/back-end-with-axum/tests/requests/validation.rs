//! Request validation: out-of-range input is a `422` naming the field.
use axa_test::prelude::*;
use four_a_test_for_delirium::app::App;
use serde_json::{json, Value};
use serial_test::serial;

fn patient() -> Value {
    json!({
        "name": "Test Patient",
        "birthDate": "1990-01-01",
        "sex": "female",
        "email": "test.patient@example.com",
        "heightAsCm": 170.2,
        "weightAsKg": 70.4,
        "bodyMassIndex": 24.2,
        "allergiesSummary": "No known allergies"
    })
}

#[tokio::test]
#[serial]
async fn valid_patient_is_accepted() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.post("/api/patients").json(&patient()).await;
        assert_eq!(res.status_code(), 200, "{}", res.text());
    })
    .await;
}

#[tokio::test]
#[serial]
async fn implausible_values_are_422_and_name_the_field() {
    request::<App, _, _>(|request, _ctx| async move {
        for (field, value) in [
            ("birthDate", json!("9999-01-01")),
            ("birthDate", json!("1800-01-01")),
            ("heightAsCm", json!(1.0e9)),
            ("bodyMassIndex", json!(-5000.0)),
            ("allergiesSummary", json!("x".repeat(10_001))),
        ] {
            let mut body = patient();
            body[field] = value;
            let res = request.post("/api/patients").json(&body).await;
            assert_eq!(res.status_code(), 422, "{field}: {}", res.text());
            let problem: Value = res.json();
            assert!(
                problem["errors"].get(field).is_some(),
                "{field} should be named: {problem}"
            );
        }
    })
    .await;
}
