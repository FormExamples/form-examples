<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const questions: { key: keyof typeof m; label: string; name: string }[] = [
		{ key: 'hypertension', label: 'Do you have hypertension (high blood pressure)?', name: 'hypertension' },
		{ key: 'migraineWithAura', label: 'Do you experience migraines with aura?', name: 'migraineWithAura' },
		{ key: 'dvtHistory', label: 'Do you have a history of DVT (deep vein thrombosis) or VTE?', name: 'dvtHistory' },
		{ key: 'breastCancer', label: 'Do you have current or recent breast cancer?', name: 'breastCancer' },
		{ key: 'liverDisease', label: 'Do you have active liver disease?', name: 'liverDisease' },
		{ key: 'diabetes', label: 'Do you have diabetes?', name: 'diabetes' },
		{ key: 'epilepsy', label: 'Do you have epilepsy?', name: 'epilepsy' },
		{ key: 'hiv', label: 'Are you HIV positive?', name: 'hiv' },
		{ key: 'stiHistory', label: 'Do you have a history of sexually transmitted infections?', name: 'stiHistory' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Conditions relevant to contraceptive eligibility (UKMEC criteria).</p>

	{#each questions as q (q.key)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.name} value={opt.value} bind:group={m[q.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
