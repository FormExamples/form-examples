<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.clinicBp;
</script>

<Fieldset legend="Step 4 of 12 — Clinic blood pressure">
	<p class="hint">Best of repeated seated clinic readings (mmHg).</p>

	<Field
		label="Clinic systolic (mmHg)"
		description="180 mmHg or above raises a severe-hypertension flag."
		inputId="clinicBp-clinicSystolic"
	>
		<NumberInput
			id="clinicBp-clinicSystolic"
			label="Clinic systolic (mmHg)"
			min={50}
			max={300}
			step={1}
			placeholder="e.g. 148"
			bind:value={c.clinicSystolic}
		/>
	</Field>

	<Field
		label="Clinic diastolic (mmHg)"
		description="120 mmHg or above raises a severe-hypertension flag."
		inputId="clinicBp-clinicDiastolic"
	>
		<NumberInput
			id="clinicBp-clinicDiastolic"
			label="Clinic diastolic (mmHg)"
			min={30}
			max={200}
			step={1}
			placeholder="e.g. 92"
			bind:value={c.clinicDiastolic}
		/>
	</Field>

	<Field
		label="Symptomatic postural drop (20 mmHg systolic or more)"
		description="Yes raises a postural-drop flag."
		inputId="clinicBp-posturalDrop"
	>
		<Select
			id="clinicBp-posturalDrop"
			label="Symptomatic postural drop (20 mmHg systolic or more)"
			bind:value={c.posturalDrop}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
