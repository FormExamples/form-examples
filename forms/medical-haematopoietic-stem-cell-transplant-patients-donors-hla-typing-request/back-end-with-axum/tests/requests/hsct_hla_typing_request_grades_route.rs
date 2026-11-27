use axa_test::prelude::*;
use medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request::app::App;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn can_get_hsct_hla_typing_request_grades() {
    request::<App, _, _>(|request, _ctx| async move {
        let res = request.get("/api/medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request/hsct_hla_typing_request_grades").await;
        assert_eq!(res.status_code(), 200);
        assert!(res.json::<serde_json::Value>().is_array());
    })
    .await;
}
