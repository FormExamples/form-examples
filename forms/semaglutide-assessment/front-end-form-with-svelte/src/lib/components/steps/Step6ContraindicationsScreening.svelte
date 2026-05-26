<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const cs = assessment.data.contraindicationsScreening;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const questions: { key: keyof typeof cs; label: string }[] = [
		{ key: 'personalHistoryMTC', label: 'Do you have a personal history of medullary thyroid carcinoma (MTC)?' },
		{ key: 'familyHistoryMTC', label: 'Do you have a family history of medullary thyroid carcinoma (MTC)?' },
		{ key: 'men2Syndrome', label: 'Have you been diagnosed with Multiple Endocrine Neoplasia syndrome type 2 (MEN2)?' },
		{ key: 'pancreatitisHistory', label: 'Do you have a history of pancreatitis?' },
		{ key: 'severeGIDisease', label: 'Do you have severe gastrointestinal disease?' },
		{ key: 'pregnancyPlanned', label: 'Are you currently pregnant or planning to become pregnant?' },
		{ key: 'breastfeeding', label: 'Are you currently breastfeeding?' },
		{ key: 'type1Diabetes', label: 'Do you have type 1 diabetes?' },
		{ key: 'diabeticRetinopathySevere', label: 'Do you have severe diabetic retinopathy?' },
		{ key: 'allergySemaglutide', label: 'Do you have a known allergy or hypersensitivity to semaglutide?' }
	];
</script>

<Fieldset legend="Contraindications Screening">
	<p class="hint">Please answer all questions carefully. These determine eligibility for semaglutide therapy.</p>

	<Alert type="warning">
		<p>Answering 'Yes' to any of the first seven questions may affect your eligibility for semaglutide treatment.</p>
	</Alert>

	{#each questions as q (q.key)}
		<Field label={q.label} required>
			<RadioGroup label={q.label}>
				{#each yesNoOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.key} value={opt.value} bind:group={cs[q.key]} required />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
