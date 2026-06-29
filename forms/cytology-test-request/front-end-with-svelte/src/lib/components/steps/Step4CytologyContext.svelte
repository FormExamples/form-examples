<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="4. Cytology Context">
	<p class="hint">HPV testing, previous abnormal cytology, and cervical-smear timing.</p>

	<Field label="HPV testing">
		<CheckboxGroup label="HPV testing">
			<label>
				<CheckboxInput label="High-risk HPV test requested" bind:checked={d.context.hpvTestRequested} />
				High-risk HPV test requested
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Previous abnormal cytology" inputId="previousAbnormalCytology">
		<Select
			id="previousAbnormalCytology"
			label="Previous abnormal cytology"
			bind:value={d.context.previousAbnormalCytology}
		>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="borderline">Borderline</option>
			<option value="low-grade">Low-grade</option>
			<option value="high-grade">High-grade</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Last menstrual period (LMP)" inputId="lastMenstrualPeriodDate">
		<DateInput
			id="lastMenstrualPeriodDate"
			label="Last menstrual period (LMP)"
			bind:value={d.context.lastMenstrualPeriodDate}
		/>
	</Field>
</Fieldset>
