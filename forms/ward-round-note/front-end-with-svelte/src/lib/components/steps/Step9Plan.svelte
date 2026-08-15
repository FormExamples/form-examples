<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.plan;
</script>

<Fieldset legend="Step 9 of 11 — Plan and jobs">
	<p class="hint">
		The plan and jobs for the day. Required component — an empty plan raises a high-priority flag.
	</p>

	<Field label="Plan and jobs for the day" inputId="plan-planAndJobs">
		<TextAreaInput
			id="plan-planAndJobs"
			label="Plan and jobs for the day"
			rows={5}
			placeholder="e.g. Continue oral antibiotics. Repeat U&Es tomorrow. Chase micro. Physio review. Aim discharge in 2 days."
			bind:value={p.planAndJobs}
		/>
	</Field>
</Fieldset>
