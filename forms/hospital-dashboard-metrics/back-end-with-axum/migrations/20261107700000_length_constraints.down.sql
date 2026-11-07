ALTER TABLE "hospital_dashboard_metric_values" DROP CONSTRAINT IF EXISTS "hospital_dashboard_metric_values_category_title_length";
ALTER TABLE "hospital_dashboard_metric_values" DROP CONSTRAINT IF EXISTS "hospital_dashboard_metric_values_metric_code_length";
ALTER TABLE "hospital_dashboard_metrics" DROP CONSTRAINT IF EXISTS "hospital_dashboard_metrics_status_length";
ALTER TABLE "hospital_dashboard_metrics" DROP CONSTRAINT IF EXISTS "hospital_dashboard_metrics_prepared_by_name_length";
ALTER TABLE "hospital_dashboard_metrics" DROP CONSTRAINT IF EXISTS "hospital_dashboard_metrics_hospital_name_length";
