<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { requestStore } from '$lib/stores/request.svelte';

	const d = requestStore.data.history;
</script>

<Fieldset legend="5. Breast History and Risk">
	<p class="hint">Previous imaging, family history, implants, pregnancy / lactation, and HRT.</p>

	<Field label="Previous mammogram" inputId="previousMammogram">
		<Select id="previousMammogram" label="Previous mammogram" bind:value={d.previousMammogram}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Previous mammogram date" inputId="previousMammogramDate">
		<DateInput
			id="previousMammogramDate"
			label="Previous mammogram date"
			bind:value={d.previousMammogramDate}
		/>
	</Field>

	<Field label="Pregnancy / lactation" inputId="pregnancyOrLactating">
		<Select id="pregnancyOrLactating" label="Pregnancy / lactation" bind:value={d.pregnancyOrLactating}>
			<option value="">Select…</option>
			<option value="no">No</option>
			<option value="pregnant">Pregnant</option>
			<option value="lactating">Lactating</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	{#if d.pregnancyOrLactating === 'pregnant' || d.pregnancyOrLactating === 'lactating'}
		<Alert type="warning" heading="Radiation justification required">
			<p>
				A pregnant or lactating patient requires IR(ME)R 2017 justification for ionising-radiation
				exposure; consider ultrasound as first-line.
			</p>
		</Alert>
	{/if}

	<Field label="Risk factors">
		<CheckboxGroup label="Risk factors">
			<label
				><CheckboxInput label="Family history of breast cancer" bind:checked={d.familyHistoryBreastCancer} />
				Family history of breast cancer</label
			>
			<label><CheckboxInput label="Breast implants" bind:checked={d.breastImplants} /> Breast implants</label>
			<label
				><CheckboxInput label="Hormone replacement therapy" bind:checked={d.hormoneReplacementTherapy} />
				Hormone replacement therapy (HRT)</label
			>
		</CheckboxGroup>
	</Field>
</Fieldset>
