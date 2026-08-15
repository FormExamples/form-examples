<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { requestStore } from '#lib/stores/request.svelte.js';

	const d = requestStore.data.preanalytical;
</script>

<Fieldset legend="5. Pre-analytical and Specimen">
	<p class="hint">
		Fasting and specimen-handling information. A fasting-required test collected non-fasting forces a
		fasting violation and lowers the pre-analytical band.
	</p>

	<Field label="Fasting">
		<CheckboxGroup label="Fasting">
			<label>
				<CheckboxInput label="Fasting required for this request" bind:checked={d.fastingRequired} />
				Fasting required for this request
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Fasting status" inputId="fastingStatus">
		<Select id="fastingStatus" label="Fasting status" bind:value={d.fastingStatus}>
			<option value="">Select…</option>
			<option value="fasting">Fasting</option>
			<option value="non-fasting">Non-fasting</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Specimen collected" inputId="specimenCollected">
		<Select id="specimenCollected" label="Specimen collected" bind:value={d.specimenCollected}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	{#if d.specimenCollected === 'yes'}
		<Field label="Collection date" inputId="collectionDate">
			<DateInput id="collectionDate" label="Collection date" bind:value={d.collectionDate} />
		</Field>

		<Field label="Collection time" inputId="collectionTime">
			<input
				id="collectionTime"
				type="time"
				class="text-input"
				aria-label="Collection time"
				bind:value={d.collectionTime}
			/>
		</Field>
	{/if}
</Fieldset>
