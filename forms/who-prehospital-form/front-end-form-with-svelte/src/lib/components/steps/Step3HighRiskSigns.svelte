<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const r = assessment.data.highRiskSigns;
</script>

<SectionCard
	title="High Risk Signs"
	description="Tick any high-risk indicators identified on rapid assessment."
>
	<h3 class="mb-2 text-base font-semibold text-gray-800">A / B (Airway / Breathing)</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Stridor" name="stridor" bind:checked={r.stridor} />
		<Checkbox label="Cyanosis" name="cyanosis" bind:checked={r.cyanosis} />
		<Checkbox
			label="Respiratory distress"
			name="respiratoryDistress"
			bind:checked={r.respiratoryDistress}
		/>
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">C (Circulation)</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Poor perfusion" name="poorPerfusion" bind:checked={r.poorPerfusion} />
		<Checkbox label="Weak fast pulse" name="weakFastPulse" bind:checked={r.weakFastPulse} />
		<Checkbox
			label="Capillary refill > 3s"
			name="capillaryRefillOver3s"
			bind:checked={r.capillaryRefillOver3s}
		/>
		<Checkbox label="Heavy bleeding" name="heavyBleeding" bind:checked={r.heavyBleeding} />
		<Checkbox label="Child: lethargy" name="childLethargy" bind:checked={r.childLethargy} />
		<Checkbox
			label="Child: sunken eyes"
			name="childSunkenEyes"
			bind:checked={r.childSunkenEyes}
		/>
		<Checkbox
			label="Child: slow skin pinch"
			name="childSlowSkinPinch"
			bind:checked={r.childSlowSkinPinch}
		/>
		<Checkbox
			label="Child: poor drinking"
			name="childPoorDrinking"
			bind:checked={r.childPoorDrinking}
		/>
		<Checkbox
			label="Adult HR < 50 or > 150"
			name="adultHrUnder50OrOver150"
			bind:checked={r.adultHrUnder50OrOver150}
		/>
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">D (Disability)</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Unresponsive" name="unresponsive" bind:checked={r.unresponsive} />
		<Checkbox
			label="Acute convulsions"
			name="acuteConvulsions"
			bind:checked={r.acuteConvulsions}
		/>
		<Checkbox
			label="Hypoglycaemia"
			name="hypoglycaemia"
			bind:checked={r.hypoglycaemia}
		/>
		<Checkbox
			label="Acute focal neurologic deficit"
			name="acuteFocalNeurologicDeficit"
			bind:checked={r.acuteFocalNeurologicDeficit}
		/>
		<Checkbox
			label="Altered mental status with fever / hypothermia / stiff neck / headache"
			name="alteredMentalStatusWithFeverHypothermiaStiffNeckHeadache"
			bind:checked={r.alteredMentalStatusWithFeverHypothermiaStiffNeckHeadache}
		/>
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Other</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="High risk trauma" name="highRiskTrauma" bind:checked={r.highRiskTrauma} />
		<Checkbox label="Threatened limb" name="threatenedLimb" bind:checked={r.threatenedLimb} />
		<Checkbox label="Snake bite" name="snakeBite" bind:checked={r.snakeBite} />
		<Checkbox
			label="Poisoning, ingestion, chemical exposure"
			name="poisoningIngestionChemicalExposure"
			bind:checked={r.poisoningIngestionChemicalExposure}
		/>
		<Checkbox
			label="Violent or aggressive"
			name="violentOrAggressive"
			bind:checked={r.violentOrAggressive}
		/>
		<Checkbox
			label="Temp > 39°C or < 36°C"
			name="tempOver39OrUnder36"
			bind:checked={r.tempOver39OrUnder36}
		/>
		<Checkbox
			label="Acute testicular pain or priapism"
			name="acuteTesticularPainOrPriapism"
			bind:checked={r.acuteTesticularPainOrPriapism}
		/>
		<Checkbox
			label="Pregnant with high-risk findings"
			name="pregnantWithHighRiskFindings"
			bind:checked={r.pregnantWithHighRiskFindings}
		/>
		<Checkbox
			label="Adult severe chest / abdominal pain or ECG ischaemia"
			name="adultSevereChestOrAbdominalPainOrEcgIschaemia"
			bind:checked={r.adultSevereChestOrAbdominalPainOrEcgIschaemia}
		/>
		<Checkbox
			label="Infant < 8 days"
			name="infantUnder8Days"
			bind:checked={r.infantUnder8Days}
		/>
		<Checkbox
			label="Infant < 2 months with temp > 39°C or < 36°C"
			name="infantUnder2MonthsWithTempOver39OrUnder36"
			bind:checked={r.infantUnder2MonthsWithTempOver39OrUnder36}
		/>
	</div>
</SectionCard>
