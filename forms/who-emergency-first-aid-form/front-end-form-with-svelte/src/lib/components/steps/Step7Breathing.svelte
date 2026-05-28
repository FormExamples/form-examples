<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const b = assessment.data.breathing;
</script>

<Fieldset title="B — Breathing" description="Breathing assessment and intervention.">
	<h3 class="mb-2 text-base font-semibold text-gray-800">Assessment</h3>
	<Checkbox
		label="Normal — breathing is regular and unlaboured"
		name="brNormal"
		bind:checked={b.assessmentNormal}
	/>
	<TextAreaInput
		label="Findings (e.g. rate, effort, accessory muscle use, abnormal sounds)"
		name="brFindings"
		bind:value={b.assessmentFindings}
		rows={3}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Intervention</h3>
	<Checkbox
		label="Maintained position of patient comfort"
		name="brComfort"
		bind:checked={b.interventions.maintainedPositionOfComfort}
	/>
	<Checkbox label="None" name="brNone" bind:checked={b.interventions.none} />
</Fieldset>
