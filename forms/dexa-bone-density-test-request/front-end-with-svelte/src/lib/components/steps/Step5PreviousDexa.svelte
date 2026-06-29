<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const d = requestStore.data;
</script>

<Fieldset legend="5. Previous DEXA">
	<p class="hint">
		A meaningful prior DEXA within the last two years (outside treatment monitoring) is flagged as a
		possible duplicate.
	</p>

	<Field label="Previous DEXA result" inputId="previousDexa">
		<Select id="previousDexa" label="Previous DEXA result" bind:value={d.previousDexa.previousDexa}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="normal">Normal</option>
			<option value="osteopenia">Osteopenia</option>
			<option value="osteoporosis">Osteoporosis</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Previous DEXA date" inputId="previousDexaDate">
		<DateInput
			id="previousDexaDate"
			label="Previous DEXA date"
			bind:value={d.previousDexa.previousDexaDate}
		/>
	</Field>
</Fieldset>
