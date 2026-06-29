<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.chiefComplaint;
	const onsetOptions = [{ value: 'sudden', label: 'Sudden' }, { value: 'gradual', label: 'Gradual' }];
	const progressionOptions = [
		{ value: 'improving', label: 'Improving' },
		{ value: 'stable', label: 'Stable' },
		{ value: 'worsening', label: 'Worsening' }
	];
</script>

<Fieldset legend="Chief Complaint">
	<p class="hint">Primary neurological symptom and presentation.</p>

	<Field label="Primary neurological symptom" required inputId="primarySymptom">
		<TextAreaInput id="primarySymptom" label="Primary symptom" rows={3} required placeholder="Describe the main symptom..." bind:value={c.primarySymptom} />
	</Field>

	<Field label="Onset date" inputId="onsetDate">
		<DateInput id="onsetDate" label="Onset date" bind:value={c.onsetDate} />
	</Field>

	<Field label="Onset type">
		<RadioGroup label="Onset type">
			{#each onsetOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="onsetType" value={opt.value} bind:group={c.onsetType} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Duration" inputId="duration">
		<TextInput id="duration" label="Duration" placeholder="e.g., 2 hours, 3 days, ongoing" bind:value={c.duration} />
	</Field>

	<Field label="Progression">
		<RadioGroup label="Progression">
			{#each progressionOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="progression" value={opt.value} bind:group={c.progression} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Associated symptoms" inputId="associatedSymptoms">
		<TextAreaInput id="associatedSymptoms" label="Associated symptoms" rows={3} placeholder="e.g., nausea, vomiting, vision changes..." bind:value={c.associatedSymptoms} />
	</Field>

	<Field label="Precipitating event" inputId="precipitatingEvent">
		<TextAreaInput id="precipitatingEvent" label="Precipitating event" rows={2} placeholder="e.g., trauma, exertion, stress, none" bind:value={c.precipitatingEvent} />
	</Field>
</Fieldset>
