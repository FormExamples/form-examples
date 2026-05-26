<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const ct = assessment.data.currentTreatment;
</script>

<Fieldset legend="Current Treatment">
	<p class="hint">Active treatment regimen and response.</p>

	<Field label="Active Regimen" inputId="activeRegimen">
		<TextInput id="activeRegimen" label="Active Regimen" placeholder="e.g., FOLFIRI + Bevacizumab" bind:value={ct.activeRegimen} />
	</Field>

	<Field label="Cycle Number" inputId="cycleNumber">
		<NumberInput id="cycleNumber" label="Cycle Number" min={1} max={50} bind:value={ct.cycleNumber} />
	</Field>

	<Field label="Last Treatment Date" inputId="lastTxDate">
		<DateInput id="lastTxDate" label="Last Treatment Date" bind:value={ct.lastTreatmentDate} />
	</Field>

	<Field label="Response Assessment" inputId="responseAssessment">
		<Select id="responseAssessment" label="Response Assessment" bind:value={ct.responseAssessment}>
			<option value="">-- Select --</option>
			<option value="complete-response">Complete Response (CR)</option>
			<option value="partial-response">Partial Response (PR)</option>
			<option value="stable-disease">Stable Disease (SD)</option>
			<option value="progressive-disease">Progressive Disease (PD)</option>
			<option value="not-yet-assessed">Not Yet Assessed</option>
		</Select>
	</Field>
</Fieldset>
