<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="3. ABO / RhD Grouping">
	<p class="hint">The determined ABO and RhD group and concordance with the historical group on record.</p>

	<Field label="ABO group" inputId="aboGroup">
		<Select id="aboGroup" label="ABO group" bind:value={d.aboGroup}>
			<option value="">Select…</option>
			<option value="a">A</option>
			<option value="b">B</option>
			<option value="o">O</option>
			<option value="ab">AB</option>
		</Select>
	</Field>

	<Field label="RhD group" inputId="rhdGroup">
		<Select id="rhdGroup" label="RhD group" bind:value={d.rhdGroup}>
			<option value="">Select…</option>
			<option value="positive">RhD positive</option>
			<option value="negative">RhD negative</option>
		</Select>
	</Field>

	<Field label="Historical-group concordance">
		<CheckboxGroup label="Historical-group concordance">
			<label>
				<CheckboxInput
					label="Current group is concordant with the historical group on record"
					bind:checked={d.historicalGroupConcordant}
				/> Current group is concordant with the historical group on record
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.aboGroup !== '' && !d.historicalGroupConcordant}
		<Alert type="error" heading="ABO discrepancy">
			<p>
				The current group is not concordant with the historical group. This is a possible
				Wrong-Blood-in-Tube / identity event: it auto-escalates the follow-up urgency to a critical
				alert. Do not issue until the discrepancy is resolved.
			</p>
		</Alert>
	{/if}
</Fieldset>
