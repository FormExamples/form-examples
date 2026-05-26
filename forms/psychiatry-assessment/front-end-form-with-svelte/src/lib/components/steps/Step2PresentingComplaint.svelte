<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.presentingComplaint;
	const severityOptions = [
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
</script>

<Fieldset legend="Presenting Complaint">
	<p class="hint">Current reason for assessment.</p>

	<Field label="Chief Complaint" inputId="chiefComplaint">
		<TextAreaInput id="chiefComplaint" label="Chief complaint" rows={4} bind:value={p.chiefComplaint} />
	</Field>

	<Field label="Onset Date" inputId="onsetDate">
		<DateInput id="onsetDate" label="Onset date" bind:value={p.onsetDate} />
	</Field>

	<Field label="Duration" inputId="duration" description="e.g. 3 weeks, 6 months">
		<TextInput id="duration" label="Duration" bind:value={p.duration} />
	</Field>

	<Field label="Severity">
		<RadioGroup label="Severity">
			{#each severityOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="severity" value={opt.value} bind:group={p.severity} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Precipitating Factors" inputId="precipitatingFactors">
		<TextAreaInput id="precipitatingFactors" label="Precipitating factors" rows={3} bind:value={p.precipitatingFactors} />
	</Field>
</Fieldset>
