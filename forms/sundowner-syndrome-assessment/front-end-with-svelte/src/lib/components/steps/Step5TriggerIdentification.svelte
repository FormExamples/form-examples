<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.triggerIdentification;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type TriggerKey = Exclude<keyof typeof t, 'otherTriggers'>;
	const triggers: { key: TriggerKey; label: string }[] = [
		{ key: 'fatigue', label: 'Fatigue / tiredness' },
		{ key: 'hunger', label: 'Hunger' },
		{ key: 'pain', label: 'Pain' },
		{ key: 'infection', label: 'Infection' },
		{ key: 'dehydration', label: 'Dehydration' },
		{ key: 'sensoryOverload', label: 'Sensory overload' },
		{ key: 'unfamiliarSurroundings', label: 'Unfamiliar surroundings' },
		{ key: 'carerChange', label: 'Change of carer' },
		{ key: 'lowLight', label: 'Low light / shadows' },
		{ key: 'medicationTiming', label: 'Medication timing' }
	];
</script>

<Fieldset legend="Trigger Identification">
	<p class="hint">Identify factors that appear to precipitate or worsen episodes.</p>

	<div class="trigger-grid">
		{#each triggers as trig (trig.key)}
			<Field label={trig.label}>
				<RadioGroup label={trig.label}>
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name={trig.key} value={opt.value} bind:group={t[trig.key]} /> {opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
		{/each}
	</div>

	<Field label="Other triggers" inputId="otherTriggers">
		<TextAreaInput id="otherTriggers" label="Other triggers" rows={3} bind:value={t.otherTriggers} />
	</Field>
</Fieldset>

<style>
	.trigger-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem 1.5rem;
	}
	@media (max-width: 640px) {
		.trigger-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
