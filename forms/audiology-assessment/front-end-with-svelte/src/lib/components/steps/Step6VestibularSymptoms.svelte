<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const v = assessment.data.vestibularSymptoms;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const rows: { key: 'vertigo' | 'dizziness' | 'balanceProblems' | 'dixHallpike' | 'nystagmus' | 'fallsHistory'; label: string }[] = [
		{ key: 'vertigo', label: 'Do you experience vertigo (a spinning sensation)?' },
		{ key: 'dizziness', label: 'Do you experience dizziness?' },
		{ key: 'balanceProblems', label: 'Do you have balance problems?' },
		{ key: 'dixHallpike', label: 'Dix-Hallpike test positive?' },
		{ key: 'nystagmus', label: 'Nystagmus observed?' },
		{ key: 'fallsHistory', label: 'Have you had any falls?' }
	];
</script>

<Fieldset legend="Vestibular Symptoms">
	<p class="hint">Balance, vertigo, and dizziness.</p>

	{#each rows as r (r.key)}
		<Field label={r.label}>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={r.key} value={opt.value} bind:group={v[r.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	{#if v.vertigo === 'yes'}
		<Field label="Describe the vertigo episodes" inputId="vertigoDetails">
			<TextAreaInput id="vertigoDetails" label="Vertigo details" rows={3} bind:value={v.vertigoDetails} />
		</Field>
	{/if}

	{#if v.fallsHistory === 'yes'}
		<Field label="How often do falls occur?" inputId="fallsFrequency">
			<TextInput id="fallsFrequency" label="Falls frequency" bind:value={v.fallsFrequency} />
		</Field>
	{/if}
</Fieldset>
