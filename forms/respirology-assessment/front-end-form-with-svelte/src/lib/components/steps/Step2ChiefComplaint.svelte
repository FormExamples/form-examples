<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const c = assessment.data.chiefComplaint;
</script>

<Fieldset legend="Chief Complaint">
	<p class="hint">Primary respiratory symptom and timeline.</p>

	<Field label="Primary Respiratory Symptom" inputId="primarySymptom">
		<TextAreaInput id="primarySymptom" label="Primary symptom" rows={3} bind:value={c.primarySymptom} />
	</Field>

	<Field label="Onset Date" inputId="onsetDate">
		<DateInput id="onsetDate" label="Onset date" bind:value={c.onsetDate} />
	</Field>

	<Field label="Duration" inputId="duration" description="e.g. 3 months, 2 years, acute onset">
		<TextInput id="duration" label="Duration" bind:value={c.duration} />
	</Field>

	<Field label="Severity Rating (1-10)" inputId="severityRating">
		<NumberInput id="severityRating" label="Severity rating" min={1} max={10} step={1} bind:value={c.severityRating} />
	</Field>
</Fieldset>
