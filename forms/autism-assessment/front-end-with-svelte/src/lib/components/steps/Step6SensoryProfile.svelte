<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const sp = assessment.data.sensoryProfile;

	const sensoryOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];

	const rows: { key: 'visualSensitivity' | 'auditorySensitivity' | 'tactileSensitivity' | 'olfactorySensitivity' | 'gustatorySensitivity'; label: string }[] = [
		{ key: 'visualSensitivity', label: 'Visual sensitivity (e.g., bright lights, certain patterns, visual overload)' },
		{ key: 'auditorySensitivity', label: 'Auditory sensitivity (e.g., loud sounds, background noise)' },
		{ key: 'tactileSensitivity', label: 'Tactile sensitivity (e.g., clothing textures, light touch, temperature)' },
		{ key: 'olfactorySensitivity', label: 'Olfactory sensitivity (e.g., certain smells, perfumes, food odors)' },
		{ key: 'gustatorySensitivity', label: 'Gustatory sensitivity (e.g., food textures, specific tastes, limited diet)' }
	];
</script>

<Fieldset legend="Sensory Profile">
	<p class="hint">Sensory sensitivities and seeking behaviors.</p>

	{#each rows as r (r.key)}
		<Field label={r.label} required>
			<RadioGroup label={r.label}>
				{#each sensoryOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={r.key} value={opt.value} bind:group={sp[r.key]} required /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Sensory seeking behaviors" inputId="sensorySeekingBehaviors">
		<TextAreaInput id="sensorySeekingBehaviors" label="Sensory seeking behaviors" rows={3} bind:value={sp.sensorySeekingBehaviors} />
	</Field>
</Fieldset>
