// Option lists shared by the step components.
// Values match the SQL CHECK constraints in sql/08_create_table_dietic_assessment.sql.

export interface Option {
	value: string;
	label: string;
}

export const SEVERITY_4: Option[] = [
	{ value: 'none', label: 'None' },
	{ value: 'mild', label: 'Mild' },
	{ value: 'moderate', label: 'Moderate' },
	{ value: 'severe', label: 'Severe' }
];

export const OPTIONS: Record<string, Option[]> = {
	role: [
		{ value: 'dietitian', label: 'Dietitian' },
		{ value: 'specialist-dietitian', label: 'Specialist dietitian' },
		{ value: 'dietetic-assistant', label: 'Dietetic assistant' },
		{ value: 'assistant-practitioner', label: 'Assistant practitioner' },
		{ value: 'dietetic-student', label: 'Dietetic student' },
		{ value: 'nutrition-nurse', label: 'Nutrition nurse' },
		{ value: 'nutritionist', label: 'Nutritionist' },
		{ value: 'other', label: 'Other' }
	],
	specialty: [
		{ value: 'general', label: 'General' },
		{ value: 'acute', label: 'Acute' },
		{ value: 'community', label: 'Community' },
		{ value: 'oncology', label: 'Oncology' },
		{ value: 'renal', label: 'Renal' },
		{ value: 'diabetes', label: 'Diabetes' },
		{ value: 'gastroenterology', label: 'Gastroenterology' },
		{ value: 'paediatrics', label: 'Paediatrics' },
		{ value: 'critical-care', label: 'Critical care' },
		{ value: 'home-enteral-feeding', label: 'Home enteral feeding' },
		{ value: 'bariatric', label: 'Bariatric' },
		{ value: 'eating-disorders', label: 'Eating disorders' },
		{ value: 'inherited-metabolic', label: 'Inherited metabolic' },
		{ value: 'other', label: 'Other' }
	],
	registrationBody: [
		{ value: 'HCPC', label: 'HCPC' },
		{ value: 'NMC', label: 'NMC' },
		{ value: 'GMC', label: 'GMC' },
		{ value: 'AfN', label: 'AfN' },
		{ value: 'other', label: 'Other' }
	],
	setting: [
		{ value: 'outpatient-clinic', label: 'Outpatient clinic' },
		{ value: 'inpatient-ward', label: 'Inpatient ward' },
		{ value: 'community', label: 'Community' },
		{ value: 'home-visit', label: 'Home visit' },
		{ value: 'general-practice', label: 'General practice' },
		{ value: 'care-home', label: 'Care home' },
		{ value: 'telephone', label: 'Telephone' },
		{ value: 'video', label: 'Video' }
	],
	appointmentType: [
		{ value: 'initial', label: 'Initial (45–60 minutes)' },
		{ value: 'review', label: 'Review' },
		{ value: 'specialist-programme', label: 'Specialist programme (up to 90 minutes)' },
		{ value: 'discharge', label: 'Discharge' }
	],
	sex: [
		{ value: 'female', label: 'Female' },
		{ value: 'male', label: 'Male' },
		{ value: 'intersex', label: 'Intersex' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	],
	referralSource: [
		{ value: 'general-practitioner', label: 'General practitioner' },
		{ value: 'hospital-consultant', label: 'Hospital consultant' },
		{ value: 'ward-team', label: 'Ward team' },
		{ value: 'nurse', label: 'Nurse' },
		{ value: 'self-referral', label: 'Self-referral' },
		{ value: 'care-home', label: 'Care home' },
		{ value: 'social-care', label: 'Social care' },
		{ value: 'speech-and-language-therapy', label: 'Speech and language therapy' },
		{ value: 'other', label: 'Other' }
	],
	diabetes: [
		{ value: 'none', label: 'None' },
		{ value: 'type-1', label: 'Type 1' },
		{ value: 'type-2', label: 'Type 2' },
		{ value: 'gestational', label: 'Gestational' },
		{ value: 'other', label: 'Other' }
	],
	gastrointestinalSurgery: [
		{ value: 'none', label: 'None' },
		{ value: 'bariatric', label: 'Bariatric' },
		{ value: 'bowel-resection', label: 'Bowel resection' },
		{ value: 'gastrectomy', label: 'Gastrectomy' },
		{ value: 'oesophagectomy', label: 'Oesophagectomy' },
		{ value: 'whipple', label: 'Whipple' },
		{ value: 'stoma-formation', label: 'Stoma formation' },
		{ value: 'other', label: 'Other' }
	],
	pregnancyStatus: [
		{ value: 'not-applicable', label: 'Not applicable' },
		{ value: 'not-pregnant', label: 'Not pregnant' },
		{ value: 'pregnant', label: 'Pregnant' },
		{ value: 'breastfeeding', label: 'Breastfeeding' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	],
	enteralRoute: [
		{ value: 'nasogastric', label: 'Nasogastric' },
		{ value: 'nasojejunal', label: 'Nasojejunal' },
		{ value: 'gastrostomy', label: 'Gastrostomy' },
		{ value: 'jejunostomy', label: 'Jejunostomy' },
		{ value: 'other', label: 'Other' }
	],
	adherence: [
		{ value: 'full', label: 'Full' },
		{ value: 'partial', label: 'Partial' },
		{ value: 'none', label: 'None' },
		{ value: 'unknown', label: 'Unknown' }
	],
	measurementMethod: [
		{ value: 'measured', label: 'Measured' },
		{ value: 'self-reported', label: 'Self-reported' },
		{ value: 'estimated', label: 'Estimated' },
		{ value: 'declined', label: 'Declined by the patient' }
	],
	weightTrend: [
		{ value: 'losing', label: 'Losing' },
		{ value: 'stable', label: 'Stable' },
		{ value: 'gaining', label: 'Gaining' },
		{ value: 'fluctuating', label: 'Fluctuating' },
		{ value: 'unknown', label: 'Unknown' }
	],
	dentition: [
		{ value: 'good', label: 'Good' },
		{ value: 'some-missing', label: 'Some teeth missing' },
		{ value: 'edentulous', label: 'Edentulous' },
		{ value: 'dentures-fitting', label: 'Dentures, well fitting' },
		{ value: 'dentures-loose', label: 'Dentures, loose' }
	],
	chewingAbility: [
		{ value: 'normal', label: 'Normal' },
		{ value: 'reduced', label: 'Reduced' },
		{ value: 'unable', label: 'Unable' }
	],
	goodFairPoor: [
		{ value: 'good', label: 'Good' },
		{ value: 'fair', label: 'Fair' },
		{ value: 'poor', label: 'Poor' }
	],
	tongueAndMucosa: [
		{ value: 'normal', label: 'Normal' },
		{ value: 'glossitis', label: 'Glossitis' },
		{ value: 'stomatitis', label: 'Stomatitis' },
		{ value: 'angular-cheilitis', label: 'Angular cheilitis' },
		{ value: 'oral-thrush', label: 'Oral thrush' },
		{ value: 'dry', label: 'Dry' },
		{ value: 'other', label: 'Other' }
	],
	skinCondition: [
		{ value: 'normal', label: 'Normal' },
		{ value: 'dry', label: 'Dry' },
		{ value: 'flaky', label: 'Flaky' },
		{ value: 'poor-wound-healing', label: 'Poor wound healing' },
		{ value: 'bruising', label: 'Bruising' },
		{ value: 'other', label: 'Other' }
	],
	hairCondition: [
		{ value: 'normal', label: 'Normal' },
		{ value: 'thin', label: 'Thin' },
		{ value: 'brittle', label: 'Brittle' },
		{ value: 'easily-plucked', label: 'Easily plucked' },
		{ value: 'other', label: 'Other' }
	],
	nailCondition: [
		{ value: 'normal', label: 'Normal' },
		{ value: 'brittle', label: 'Brittle' },
		{ value: 'spoon-shaped', label: 'Spoon-shaped' },
		{ value: 'ridged', label: 'Ridged' },
		{ value: 'other', label: 'Other' }
	],
	pressureUlcerCategory: [
		{ value: '1', label: 'Category 1' },
		{ value: '2', label: 'Category 2' },
		{ value: '3', label: 'Category 3' },
		{ value: '4', label: 'Category 4' },
		{ value: 'unstageable', label: 'Unstageable' }
	],
	portionSize: [
		{ value: 'small', label: 'Small' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'large', label: 'Large' },
		{ value: 'varies', label: 'Varies' }
	],
	appetite: [
		{ value: 'good', label: 'Good' },
		{ value: 'fair', label: 'Fair' },
		{ value: 'poor', label: 'Poor' },
		{ value: 'absent', label: 'Absent' }
	],
	iddsiDrink: [
		{ value: '0', label: '0 — Thin' },
		{ value: '1', label: '1 — Slightly thick' },
		{ value: '2', label: '2 — Mildly thick' },
		{ value: '3', label: '3 — Moderately thick' },
		{ value: '4', label: '4 — Extremely thick' }
	],
	iddsiFood: [
		{ value: '3', label: '3 — Liquidised' },
		{ value: '4', label: '4 — Pureed' },
		{ value: '5', label: '5 — Minced and moist' },
		{ value: '6', label: '6 — Soft and bite-sized' },
		{ value: '7', label: '7 — Regular' }
	],
	hydrationSigns: [
		{ value: 'well-hydrated', label: 'Well hydrated' },
		{ value: 'mild-dehydration', label: 'Mild dehydration' },
		{ value: 'moderate-dehydration', label: 'Moderate dehydration' },
		{ value: 'severe-dehydration', label: 'Severe dehydration' },
		{ value: 'fluid-overload', label: 'Fluid overload' }
	],
	allergySeverity: [
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' },
		{ value: 'anaphylaxis', label: 'Anaphylaxis' }
	],
	avoidanceReason: [
		{ value: 'allergy', label: 'Allergy' },
		{ value: 'intolerance', label: 'Intolerance' },
		{ value: 'medical-advice', label: 'Medical advice' },
		{ value: 'religious', label: 'Religious' },
		{ value: 'cultural', label: 'Cultural' },
		{ value: 'ethical', label: 'Ethical' },
		{ value: 'dislike', label: 'Dislike' },
		{ value: 'cost', label: 'Cost' },
		{ value: 'other', label: 'Other' }
	],
	therapeuticDiet: [
		{ value: 'none', label: 'None' },
		{ value: 'gluten-free', label: 'Gluten-free' },
		{ value: 'low-fodmap', label: 'Low FODMAP' },
		{ value: 'renal', label: 'Renal' },
		{ value: 'diabetic', label: 'Diabetic' },
		{ value: 'low-sodium', label: 'Low sodium' },
		{ value: 'low-potassium', label: 'Low potassium' },
		{ value: 'high-energy-high-protein', label: 'High energy, high protein' },
		{ value: 'ketogenic', label: 'Ketogenic' },
		{ value: 'low-residue', label: 'Low residue' },
		{ value: 'other', label: 'Other' }
	],
	dietaryPattern: [
		{ value: 'omnivore', label: 'Omnivore' },
		{ value: 'vegetarian', label: 'Vegetarian' },
		{ value: 'vegan', label: 'Vegan' },
		{ value: 'pescatarian', label: 'Pescatarian' },
		{ value: 'halal', label: 'Halal' },
		{ value: 'kosher', label: 'Kosher' },
		{ value: 'other', label: 'Other' }
	],
	appetiteChange: [
		{ value: 'none', label: 'No change' },
		{ value: 'increased', label: 'Increased' },
		{ value: 'decreased', label: 'Decreased' }
	],
	dysphagiaScreenOutcome: [
		{ value: 'pass', label: 'Pass' },
		{ value: 'fail', label: 'Fail' },
		{ value: 'not-done', label: 'Not done' }
	],
	bristolStoolType: [
		{ value: '1', label: '1 — Separate hard lumps' },
		{ value: '2', label: '2 — Lumpy and sausage-like' },
		{ value: '3', label: '3 — Sausage with cracks' },
		{ value: '4', label: '4 — Smooth and soft' },
		{ value: '5', label: '5 — Soft blobs' },
		{ value: '6', label: '6 — Mushy with ragged edges' },
		{ value: '7', label: '7 — Entirely liquid' }
	],
	livingSituation: [
		{ value: 'alone', label: 'Alone' },
		{ value: 'with-partner', label: 'With a partner' },
		{ value: 'with-family', label: 'With family' },
		{ value: 'shared-house', label: 'Shared house' },
		{ value: 'care-home', label: 'Care home' },
		{ value: 'supported-living', label: 'Supported living' },
		{ value: 'homeless', label: 'Homeless' },
		{ value: 'other', label: 'Other' }
	],
	whoShops: [
		{ value: 'patient', label: 'The patient' },
		{ value: 'family', label: 'Family' },
		{ value: 'carer', label: 'Carer' },
		{ value: 'delivery', label: 'Delivery' },
		{ value: 'other', label: 'Other' }
	],
	whoCooks: [
		{ value: 'patient', label: 'The patient' },
		{ value: 'family', label: 'Family' },
		{ value: 'carer', label: 'Carer' },
		{ value: 'meal-service', label: 'Meal service' },
		{ value: 'other', label: 'Other' }
	],
	cookingSkills: [
		{ value: 'confident', label: 'Confident' },
		{ value: 'basic', label: 'Basic' },
		{ value: 'limited', label: 'Limited' },
		{ value: 'none', label: 'None' }
	],
	accessToShops: [
		{ value: 'easy', label: 'Easy' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'difficult', label: 'Difficult' },
		{ value: 'none', label: 'No access' }
	],
	workPattern: [
		{ value: 'full-time', label: 'Full time' },
		{ value: 'part-time', label: 'Part time' },
		{ value: 'shift-work', label: 'Shift work' },
		{ value: 'night-shift', label: 'Night shift' },
		{ value: 'unemployed', label: 'Unemployed' },
		{ value: 'retired', label: 'Retired' },
		{ value: 'student', label: 'Student' },
		{ value: 'carer', label: 'Carer' },
		{ value: 'unable-to-work', label: 'Unable to work' }
	],
	mealSupport: [
		{ value: 'none', label: 'None' },
		{ value: 'family', label: 'Family' },
		{ value: 'care-worker', label: 'Care worker' },
		{ value: 'meals-on-wheels', label: 'Meals on wheels' },
		{ value: 'day-centre', label: 'Day centre' },
		{ value: 'care-home-catering', label: 'Care-home catering' },
		{ value: 'other', label: 'Other' }
	],
	socialSupport: [
		{ value: 'good', label: 'Good' },
		{ value: 'some', label: 'Some' },
		{ value: 'limited', label: 'Limited' },
		{ value: 'none', label: 'None' }
	],
	activityLevel: [
		{ value: 'sedentary', label: 'Sedentary' },
		{ value: 'lightly-active', label: 'Lightly active' },
		{ value: 'moderately-active', label: 'Moderately active' },
		{ value: 'very-active', label: 'Very active' }
	],
	mobility: [
		{ value: 'independent', label: 'Independent' },
		{ value: 'walking-aid', label: 'Walking aid' },
		{ value: 'wheelchair', label: 'Wheelchair' },
		{ value: 'bed-bound', label: 'Bed-bound' }
	],
	feedingAssistance: [
		{ value: 'none', label: 'None' },
		{ value: 'prompting', label: 'Prompting' },
		{ value: 'partial', label: 'Partial' },
		{ value: 'full', label: 'Full' }
	],
	sarcf: [
		{ value: '0', label: '0 — None' },
		{ value: '1', label: '1 — Some' },
		{ value: '2', label: '2 — A lot, or unable' }
	],
	stageOfChange: [
		{ value: 'precontemplation', label: 'Precontemplation' },
		{ value: 'contemplation', label: 'Contemplation' },
		{ value: 'preparation', label: 'Preparation' },
		{ value: 'action', label: 'Action' },
		{ value: 'maintenance', label: 'Maintenance' },
		{ value: 'relapse', label: 'Relapse' }
	],
	mood: [
		{ value: 'good', label: 'Good' },
		{ value: 'low', label: 'Low' },
		{ value: 'depressed', label: 'Depressed' },
		{ value: 'variable', label: 'Variable' }
	],
	healthLiteracy: [
		{ value: 'high', label: 'High' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'low', label: 'Low' }
	],
	learningStyle: [
		{ value: 'verbal', label: 'Verbal' },
		{ value: 'written', label: 'Written' },
		{ value: 'visual', label: 'Visual' },
		{ value: 'demonstration', label: 'Demonstration' },
		{ value: 'digital', label: 'Digital' }
	],
	requirementEquation: [
		{ value: 'henry', label: 'Henry' },
		{ value: 'schofield', label: 'Schofield' },
		{ value: 'harris-benedict', label: 'Harris-Benedict' },
		{ value: 'mifflin-st-jeor', label: 'Mifflin-St Jeor' },
		{ value: 'kcal-per-kg', label: 'kcal per kg' },
		{ value: 'indirect-calorimetry', label: 'Indirect calorimetry' },
		{ value: 'other', label: 'Other' }
	],
	interventionType: [
		{ value: 'dietary-counselling', label: 'Dietary counselling' },
		{ value: 'food-first-fortification', label: 'Food-first fortification' },
		{ value: 'oral-nutritional-supplements', label: 'Oral nutritional supplements' },
		{ value: 'texture-modification', label: 'Texture modification' },
		{ value: 'enteral-nutrition', label: 'Enteral nutrition' },
		{ value: 'parenteral-nutrition', label: 'Parenteral nutrition' },
		{ value: 'weight-management', label: 'Weight management' },
		{ value: 'no-intervention', label: 'No intervention' },
		{ value: 'other', label: 'Other' }
	],
	compositeRisk: [
		{ value: 'low', label: 'Low' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'high', label: 'High' },
		{ value: 'critical', label: 'Critical' }
	]
};