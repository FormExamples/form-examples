<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const t = assessment.data.trend;
</script>

<Fieldset legend="Step 7 of 8 — Trend">
	<p class="hint">
		The previous assessment, used to detect deterioration. A total falling by &ge; 2, or a falling
		motor score, raises a red flag.
	</p>

	<Field
		label="Previous total GCS"
		description="Previous total (3-15). Leave blank if this is the first assessment."
		inputId="trend-previousTotal"
	>
		<NumberInput
			id="trend-previousTotal"
			label="Previous total GCS"
			min={3}
			max={15}
			step={1}
			bind:value={t.previousTotal}
		/>
	</Field>

	<Field
		label="Previous motor score"
		description="Previous motor score (1-6). A falling motor score is the earliest sign of deterioration."
		inputId="trend-previousMotorScore"
	>
		<NumberInput
			id="trend-previousMotorScore"
			label="Previous motor score"
			min={1}
			max={6}
			step={1}
			bind:value={t.previousMotorScore}
		/>
	</Field>

	<Field label="Previous assessment date and time" inputId="trend-previousAssessedAt">
		<TextInput
			id="trend-previousAssessedAt"
			label="Previous assessment date and time"
			type="datetime-local"
			class="date-input"
			bind:value={t.previousAssessedAt}
		/>
	</Field>
</Fieldset>
