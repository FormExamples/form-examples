<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import { requestStore } from '#lib/stores/request.svelte.js';

	const d = requestStore.data.practical;
</script>

<Fieldset legend="6. Practicalities">
	<p class="hint">Patient mobility, care setting, and the requested-by date.</p>

	<Field label="Mobility" inputId="mobility">
		<Select id="mobility" label="Mobility" bind:value={d.mobility}>
			<option value="">Select…</option>
			<option value="ambulant">Ambulant</option>
			<option value="wheelchair">Wheelchair</option>
			<option value="trolley">Trolley</option>
		</Select>
	</Field>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={d.setting}>
			<option value="">Select…</option>
			<option value="outpatient">Outpatient</option>
			<option value="inpatient">Inpatient</option>
			<option value="community">Community</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Requested-by date" inputId="requestedByDate">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={d.requestedByDate} />
	</Field>
</Fieldset>
