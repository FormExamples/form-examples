<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const s = assessment.data.situation;

	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset
	title="Situation"
	description="The first part of the SBAR communication framework. Describe what brought the patient in and what care was delivered at the referral facility."
>
	<TextAreaInput
		label="Chief complaint"
		name="chiefComplaint"
		bind:value={s.chiefComplaint}
		rows={2}
		placeholder="In the patient's own words where possible (e.g. 'severe chest pain')."
		required
	/>

	<TextAreaInput
		label="Primary diagnosis"
		name="primaryDiagnosis"
		bind:value={s.primaryDiagnosis}
		rows={2}
		required
	/>

	<RadioGroup
		label="Pregnant?"
		name="pregnant"
		options={yesNoUnknown}
		bind:value={s.pregnant}
		required
	/>

	<TextAreaInput
		label="Treatments initiated"
		name="treatmentsInitiated"
		bind:value={s.treatmentsInitiated}
		rows={3}
		placeholder="Therapies, medications, procedures, fluids initiated at the referral facility."
		required
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Episode flags</h3>
	<p class="mb-3 text-xs text-gray-500">Tick any that apply during this referral episode.</p>
	<Checkbox label="ICU stay" name="icuStay" bind:checked={s.icuStay} />
	<Checkbox label="Surgery performed" name="surgery" bind:checked={s.surgery} />
	<Checkbox label="Hospitalised" name="hospitalized" bind:checked={s.hospitalized} />
</Fieldset>
