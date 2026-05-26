<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.chiefComplaint;

	const progressionOptions = [
		{ value: 'stable', label: 'Stable' },
		{ value: 'improving', label: 'Improving' },
		{ value: 'worsening', label: 'Worsening' },
		{ value: 'fluctuating', label: 'Fluctuating' }
	];
</script>

<Fieldset legend="Chief Complaint">
	<p class="hint">Describe your primary skin concern.</p>

	<Field label="What is your primary skin concern?" inputId="primaryConcern">
		<TextAreaInput id="primaryConcern" label="Primary concern" rows={3} placeholder="Describe your main skin problem..." bind:value={c.primaryConcern} />
	</Field>

	<Field label="How long have you had this condition?" required inputId="duration">
		<TextInput id="duration" label="Duration" required placeholder="e.g., 2 weeks, 3 months, 5 years" bind:value={c.duration} />
	</Field>

	<Field label="Where on your body is it located?" required inputId="location">
		<TextInput id="location" label="Location" required placeholder="e.g., face, arms, trunk, legs" bind:value={c.location} />
	</Field>

	<Field label="How has the condition been changing?" required>
		<RadioGroup label="Progression">
			{#each progressionOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="progression" value={opt.value} bind:group={c.progression} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previous treatments tried" inputId="previousTreatments">
		<TextAreaInput id="previousTreatments" label="Previous treatments" rows={3} placeholder="List any treatments you have tried for this condition..." bind:value={c.previousTreatments} />
	</Field>
</Fieldset>
