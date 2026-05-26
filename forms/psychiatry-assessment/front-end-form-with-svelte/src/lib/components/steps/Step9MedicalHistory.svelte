<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.medicalHistory;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

	const sections: { key: 'neurologicalConditions' | 'endocrineConditions' | 'chronicPain' | 'pregnancy'; detailsKey: 'neurologicalDetails' | 'endocrineDetails' | 'chronicPainDetails' | 'pregnancyDetails'; name: string; label: string; detailsLabel: string }[] = [
		{ key: 'neurologicalConditions', detailsKey: 'neurologicalDetails', name: 'neuro', label: 'Neurological conditions?', detailsLabel: 'Neurological details' },
		{ key: 'endocrineConditions', detailsKey: 'endocrineDetails', name: 'endocrine', label: 'Endocrine conditions?', detailsLabel: 'Endocrine details' },
		{ key: 'chronicPain', detailsKey: 'chronicPainDetails', name: 'pain', label: 'Chronic pain?', detailsLabel: 'Chronic pain details' },
		{ key: 'pregnancy', detailsKey: 'pregnancyDetails', name: 'pregnancy', label: 'Currently pregnant or possibility of pregnancy?', detailsLabel: 'Pregnancy details' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Relevant medical conditions that may affect psychiatric care.</p>

	{#each sections as sec (sec.key)}
		<Field label={sec.label}>
			<RadioGroup label={sec.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={sec.name} value={opt.value} bind:group={m[sec.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if m[sec.key] === 'yes'}
			<Field label={sec.detailsLabel} inputId={`${sec.key}Details`}>
				<TextAreaInput id={`${sec.key}Details`} label={sec.detailsLabel} rows={3} bind:value={m[sec.detailsKey]} />
			</Field>
		{/if}
	{/each}
</Fieldset>
