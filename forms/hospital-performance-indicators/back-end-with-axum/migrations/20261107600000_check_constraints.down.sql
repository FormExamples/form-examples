ALTER TABLE "hospital_performance_indicator_values" DROP CONSTRAINT IF EXISTS "hospital_performance_indicator_values_category_number_check";
ALTER TABLE "hospital_performance_indicators" DROP CONSTRAINT IF EXISTS "hospital_performance_indicators_status_check";
ALTER TABLE "hospital_performance_indicators" DROP CONSTRAINT IF EXISTS "hospital_performance_indicators_period_year_check";
ALTER TABLE "hospital_performance_indicators" DROP CONSTRAINT IF EXISTS "hospital_performance_indicators_period_month_check";
