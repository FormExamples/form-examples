<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import YesNoField from '$lib/components/ui/YesNoField.svelte';

	const d = assessment.data.medicalHistory;
</script>

<Fieldset legend="Medical History">
	<p class="hint">System-by-system past medical history. Hypertension feeds the STOP-BANG score.</p>

	<h3 class="group-title">Cardiovascular</h3>
	<div class="yn-grid">
		<YesNoField label="Hypertension" name="hypertension" bind:value={d.hypertension} />
		<YesNoField label="Ischaemic heart disease" name="ischaemicHeartDisease" bind:value={d.ischaemicHeartDisease} />
		<YesNoField label="Heart failure" name="heartFailure" bind:value={d.heartFailure} />
		<YesNoField label="Valvular disease" name="valvularDisease" bind:value={d.valvularDisease} />
		<YesNoField label="Arrhythmia" name="arrhythmia" bind:value={d.arrhythmia} />
		<YesNoField label="Peripheral vascular disease" name="peripheralVascularDisease" bind:value={d.peripheralVascularDisease} />
		<YesNoField label="DVT / PE" name="dvtPe" bind:value={d.dvtPe} />
	</div>

	<h3 class="group-title">Respiratory</h3>
	<div class="yn-grid">
		<YesNoField label="Asthma" name="asthma" bind:value={d.asthma} />
		<YesNoField label="COPD" name="copd" bind:value={d.copd} />
		<YesNoField label="Sleep apnea" name="sleepApnea" bind:value={d.sleepApnea} />
		<YesNoField label="Recent URTI" name="recentUrti" bind:value={d.recentUrti} />
	</div>

	<h3 class="group-title">Neurological</h3>
	<div class="yn-grid">
		<YesNoField label="Epilepsy" name="epilepsy" bind:value={d.epilepsy} />
		<YesNoField label="Stroke / TIA" name="strokeTia" bind:value={d.strokeTia} />
		<YesNoField label="Neuromuscular disease" name="neuromuscularDisease" bind:value={d.neuromuscularDisease} />
	</div>

	<h3 class="group-title">Endocrine</h3>
	<div class="yn-grid">
		<YesNoField label="Type 1 diabetes" name="diabetesType1" bind:value={d.diabetesType1} />
		<YesNoField label="Type 2 diabetes" name="diabetesType2" bind:value={d.diabetesType2} />
		<YesNoField label="Thyroid disease" name="thyroidDisease" bind:value={d.thyroidDisease} />
		<YesNoField label="Adrenal insufficiency" name="adrenalInsufficiency" bind:value={d.adrenalInsufficiency} />
	</div>

	<h3 class="group-title">Renal & Hepatic</h3>
	<div class="yn-grid">
		<YesNoField label="Chronic kidney disease" name="chronicKidneyDisease" bind:value={d.chronicKidneyDisease} />
		<YesNoField label="Dialysis" name="dialysis" bind:value={d.dialysis} />
		<YesNoField label="Liver disease" name="liverDisease" bind:value={d.liverDisease} />
		<YesNoField label="Jaundice" name="jaundice" bind:value={d.jaundice} />
		<YesNoField label="Cirrhosis" name="cirrhosis" bind:value={d.cirrhosis} />
	</div>

	<h3 class="group-title">Haematologic & Gastrointestinal</h3>
	<div class="yn-grid">
		<YesNoField label="Anaemia" name="anaemia" bind:value={d.anaemia} />
		<YesNoField label="Bleeding disorder" name="bleedingDisorder" bind:value={d.bleedingDisorder} />
		<YesNoField label="Clotting disorder" name="clottingDisorder" bind:value={d.clottingDisorder} />
		<YesNoField label="GORD" name="gord" bind:value={d.gord} />
		<YesNoField label="Peptic ulcer" name="pepticUlcer" bind:value={d.pepticUlcer} />
	</div>

	<h3 class="group-title">Musculoskeletal & Psychiatric</h3>
	<div class="yn-grid">
		<YesNoField label="Rheumatoid arthritis" name="rheumatoidArthritis" bind:value={d.rheumatoidArthritis} />
		<YesNoField label="Limited mobility" name="limitedMobility" bind:value={d.limitedMobility} />
		<YesNoField label="Anxiety" name="anxiety" bind:value={d.anxiety} />
		<YesNoField label="Depression" name="depression" bind:value={d.depression} />
		<YesNoField label="Other psychiatric" name="otherPsychiatric" bind:value={d.otherPsychiatric} />
	</div>

	<Field label="Other relevant medical history" inputId="otherDetails">
		<TextAreaInput id="otherDetails" label="Other relevant medical history" rows={3} bind:value={d.otherDetails} />
	</Field>
</Fieldset>

<style>
	.group-title {
		margin: 1.25rem 0 0.25rem;
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--color-base-content);
		opacity: 0.7;
	}
	.yn-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem 1.5rem;
	}
	@media (max-width: 640px) {
		.yn-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
