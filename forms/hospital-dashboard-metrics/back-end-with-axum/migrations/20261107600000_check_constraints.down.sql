ALTER TABLE "hospital_dashboard_metric_values" DROP CONSTRAINT IF EXISTS "hospital_dashboard_metric_values_category_number_check";
ALTER TABLE "hospital_dashboard_metrics" DROP CONSTRAINT IF EXISTS "hospital_dashboard_metrics_status_check";
ALTER TABLE "hospital_dashboard_metrics" DROP CONSTRAINT IF EXISTS "hospital_dashboard_metrics_period_year_check";
ALTER TABLE "hospital_dashboard_metrics" DROP CONSTRAINT IF EXISTS "hospital_dashboard_metrics_period_month_check";
