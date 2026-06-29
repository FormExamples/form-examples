<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const e = assessment.data.environmentalAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const items: { key: 'adequateDaylight' | 'excessiveNoise' | 'unfamiliarEnvironment' | 'cluttered' | 'mirrorsOrShadows' | 'consistentRoutine' | 'adequateSocialContact'; label: string }[] = [
		{ key: 'adequateDaylight', label: 'Adequate daylight exposure?' },
		{ key: 'excessiveNoise', label: 'Excessive noise?' },
		{ key: 'unfamiliarEnvironment', label: 'Unfamiliar environment?' },
		{ key: 'cluttered', label: 'Cluttered environment?' },
		{ key: 'mirrorsOrShadows', label: 'Mirrors or shadows present?' },
		{ key: 'consistentRoutine', label: 'Consistent daily routine?' },
		{ key: 'adequateSocialContact', label: 'Adequate social contact?' }
	];
</script>

<Fieldset legend="Environmental Assessment">
	<p class="hint">Environmental factors that may contribute to or reduce sundowning.</p>

	<div class="env-grid">
		{#each items as item (item.key)}
			<Field label={item.label}>
				<RadioGroup label={item.label}>
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name={item.key} value={opt.value} bind:group={e[item.key]} /> {opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
		{/each}
	</div>

	<Field label="Environmental notes" inputId="environmentalNotes">
		<TextAreaInput id="environmentalNotes" label="Environmental notes" rows={3} bind:value={e.environmentalNotes} />
	</Field>
</Fieldset>

<style>
	.env-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem 1.5rem;
	}
	@media (max-width: 640px) {
		.env-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
