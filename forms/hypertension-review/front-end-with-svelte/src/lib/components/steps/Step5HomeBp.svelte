<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const h = assessment.data.homeBp;
</script>

<Fieldset legend="Step 5 of 12 — Home / ambulatory blood pressure">
	<p class="hint">
		HBPM or ABPM daytime average (mmHg) — the primary basis for control when recorded.
	</p>

	<Field label="Home/ambulatory systolic (mmHg)" inputId="homeBp-homeSystolic">
		<NumberInput
			id="homeBp-homeSystolic"
			label="Home/ambulatory systolic (mmHg)"
			min={50}
			max={300}
			step={1}
			placeholder="e.g. 138"
			bind:value={h.homeSystolic}
		/>
	</Field>

	<Field label="Home/ambulatory diastolic (mmHg)" inputId="homeBp-homeDiastolic">
		<NumberInput
			id="homeBp-homeDiastolic"
			label="Home/ambulatory diastolic (mmHg)"
			min={30}
			max={200}
			step={1}
			placeholder="e.g. 84"
			bind:value={h.homeDiastolic}
		/>
	</Field>

	<Field label="Monitoring method" inputId="homeBp-monitoringMethod">
		<Select id="homeBp-monitoringMethod" label="Monitoring method" bind:value={h.monitoringMethod}>
			<option value="">— Select —</option>
			<option value="clinic-only">Clinic only</option>
			<option value="hbpm">Home (HBPM)</option>
			<option value="abpm">Ambulatory (ABPM)</option>
		</Select>
	</Field>
</Fieldset>
