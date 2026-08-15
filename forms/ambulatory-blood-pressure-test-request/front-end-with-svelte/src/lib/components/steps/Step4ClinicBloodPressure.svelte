<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';

	const d = $state(request.data.bloodPressure);
</script>

<Fieldset legend="Clinic blood pressure">
	<p class="hint">
		Most recent clinic BP — drives the appropriateness and triage axes. ≥180/120 escalates triage.
	</p>

	<div class="field-grid">
		<Field label="Clinic systolic BP (mmHg)" inputId="clinicBpSystolic">
			<NumberInput id="clinicBpSystolic" label="Clinic systolic BP" min={50} max={300} bind:value={d.clinicBpSystolic} />
		</Field>
		<Field label="Clinic diastolic BP (mmHg)" inputId="clinicBpDiastolic">
			<NumberInput id="clinicBpDiastolic" label="Clinic diastolic BP" min={20} max={200} bind:value={d.clinicBpDiastolic} />
		</Field>
	</div>

	<label class="bool-field">
		<CheckboxInput id="onAntihypertensives" label="Currently taking antihypertensive medication" bind:checked={d.onAntihypertensives} />
		<span>Currently taking antihypertensive medication</span>
	</label>

	<Field label="Current medications" inputId="currentMedications">
		<TextAreaInput
			id="currentMedications"
			label="Current medications"
			rows={2}
			placeholder="e.g. Amlodipine 5 mg OD, Ramipril 2.5 mg OD"
			bind:value={d.currentMedications}
		/>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
	.bool-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.75rem 0;
	}
</style>
