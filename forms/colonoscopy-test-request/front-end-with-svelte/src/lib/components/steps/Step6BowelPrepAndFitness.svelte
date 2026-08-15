<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data;
</script>

<Fieldset legend="6. Bowel Prep and Fitness">
	<p class="hint">Bowel-preparation fitness, renal function, and ASA grade complete the pre-procedure risk axis.</p>

	<Field label="Bowel-preparation fitness">
		<CheckboxGroup label="Bowel-preparation fitness">
			<label><CheckboxInput label="Assessed as fit for bowel preparation" bind:checked={d.fitness.fitForBowelPrep} /> Assessed as fit for bowel preparation</label>
		</CheckboxGroup>
	</Field>

	{#if !d.fitness.fitForBowelPrep}
		<Alert type="warning" heading="Bowel-prep fitness not confirmed">
			<p>
				Confirm bowel-prep fitness; consider CT colonography or an adjusted regimen for frail or
				renal-impaired patients.
			</p>
		</Alert>
	{/if}

	<Field label="Planned bowel-prep agent" inputId="bowelPrepAgent">
		<TextInput id="bowelPrepAgent" label="Planned bowel-prep agent" placeholder="e.g. PEG-based split-dose" bind:value={d.fitness.bowelPrepAgent} />
	</Field>

	<Field label="Renal function">
		<CheckboxGroup label="Renal function">
			<label><CheckboxInput label="Chronic kidney disease" bind:checked={d.fitness.chronicKidneyDisease} /> Chronic kidney disease</label>
		</CheckboxGroup>
	</Field>

	<Field label="eGFR" inputId="egfrMlMin" description="mL/min — reduced eGFR affects bowel-prep choice.">
		<NumberInput id="egfrMlMin" label="eGFR" min={0} step={0.1} bind:value={d.fitness.egfrMlMin} />
	</Field>

	<Field label="ASA physical-status grade" inputId="asaGrade">
		<Select id="asaGrade" label="ASA physical-status grade" bind:value={d.fitness.asaGrade}>
			<option value="">Select…</option>
			<option value="I">I — Normal healthy patient</option>
			<option value="II">II — Mild systemic disease</option>
			<option value="III">III — Severe systemic disease</option>
			<option value="IV">IV — Severe disease, constant threat to life</option>
			<option value="V">V — Moribund</option>
		</Select>
	</Field>
</Fieldset>
