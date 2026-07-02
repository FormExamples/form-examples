<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const r = assessment.data.rehab;
</script>

<Fieldset legend="Step 9 of 11 — Pulmonary rehabilitation and oxygen">
	<p class="hint">Rehab status, home-oxygen use, and resting oxygen saturation.</p>

	<Field label="Pulmonary-rehabilitation status" inputId="rehab-pulmonaryRehabStatus">
		<Select
			id="rehab-pulmonaryRehabStatus"
			label="Pulmonary-rehabilitation status"
			bind:value={r.pulmonaryRehabStatus}
		>
			<option value="">— Select —</option>
			<option value="completed">Completed</option>
			<option value="referred">Referred</option>
			<option value="eligible-not-referred">Eligible, not referred</option>
			<option value="not-indicated">Not indicated</option>
		</Select>
	</Field>

	<Field label="Home-oxygen use" inputId="rehab-oxygenUse">
		<Select id="rehab-oxygenUse" label="Home-oxygen use" bind:value={r.oxygenUse}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="long-term">Long-term oxygen therapy</option>
			<option value="ambulatory">Ambulatory oxygen</option>
		</Select>
	</Field>

	<Field label="Resting SpO₂ on room air (%)" inputId="rehab-restingSpo2">
		<NumberInput
			id="rehab-restingSpo2"
			label="Resting SpO₂ on room air (%)"
			min={50}
			max={100}
			step={1}
			bind:value={r.restingSpo2}
		/>
	</Field>
</Fieldset>
