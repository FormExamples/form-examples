<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const g = assessment.data.goalsPriorities;
</script>

<Fieldset legend="Goals and Priorities">
	<p class="hint">Identify your goals and priorities for occupational therapy intervention.</p>

	<Field label="Short-Term Goals" inputId="shortTermGoals">
		<TextAreaInput id="shortTermGoals" label="Short-Term Goals" rows={3} placeholder="What would you like to achieve in the next 2-4 weeks?" bind:value={g.shortTermGoals} />
	</Field>

	<Field label="Long-Term Goals" inputId="longTermGoals">
		<TextAreaInput id="longTermGoals" label="Long-Term Goals" rows={3} placeholder="What would you like to achieve in the next 3-6 months?" bind:value={g.longTermGoals} />
	</Field>

	<Field label="Priority Areas" inputId="priorityAreas">
		<TextAreaInput id="priorityAreas" label="Priority Areas" rows={3} placeholder="Which areas of daily life are most important for you to improve?" bind:value={g.priorityAreas} />
	</Field>

	<Field label="Discharge Goals" inputId="dischargeGoals">
		<TextAreaInput id="dischargeGoals" label="Discharge Goals" rows={3} placeholder="What would successful completion of OT look like for you?" bind:value={g.dischargeGoals} />
	</Field>
</Fieldset>
