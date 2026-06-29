<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.context;
</script>

<Fieldset legend="4. Clinical Context">
	<p class="hint">
		Indication, clinical details, known cancer site, and prior marker value — the highest-value
		fields.
	</p>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">— Select —</option>
			<option value="suspected-malignancy">Suspected malignancy</option>
			<option value="cancer-monitoring">Cancer monitoring</option>
			<option value="treatment-response">Treatment response</option>
			<option value="recurrence-surveillance">Recurrence surveillance</option>
			<option value="screening-high-risk">Screening (high-risk)</option>
			<option value="characterise-mass">Characterise mass</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Clinical details" inputId="clinicalDetails" required>
		<TextAreaInput
			id="clinicalDetails"
			label="Clinical details"
			rows={3}
			placeholder="e.g. Postmenopausal woman with abdominal distension and pelvic mass."
			bind:value={d.clinicalDetails}
		/>
	</Field>

	<Field label="Known / suspected cancer site" inputId="knownCancerSite">
		<TextInput id="knownCancerSite" label="Known / suspected cancer site" bind:value={d.knownCancerSite} />
	</Field>

	<Field label="Treatment status" inputId="onTreatment">
		<label class="flex items-center gap-2" for="onTreatment">
			<CheckboxInput id="onTreatment" label="Patient is currently on cancer treatment" bind:checked={d.onTreatment} />
			<span class="text-sm text-base-content">Patient is currently on cancer treatment</span>
		</label>
	</Field>

	<Field label="Previous marker value" inputId="previousMarkerValue" description="The most recent prior result, if monitoring.">
		<NumberInput
			id="previousMarkerValue"
			label="Previous marker value"
			min={0}
			step={0.01}
			bind:value={d.previousMarkerValue}
		/>
	</Field>

	<Field label="Previous marker date" inputId="previousMarkerDate">
		<DateInput id="previousMarkerDate" label="Previous marker date" bind:value={d.previousMarkerDate} />
	</Field>
</Fieldset>
