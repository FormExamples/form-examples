<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.plan;
</script>

<Fieldset legend="Step 7 of 8 — Agreed actions and plan">
	<p class="hint">The follow-up plan, the next review date, and whether the review is complete.</p>

	<Field label="Follow-up plan and agreed actions" inputId="plan-followUpPlan">
		<TextAreaInput
			id="plan-followUpPlan"
			label="Follow-up plan and agreed actions"
			rows={3}
			placeholder="e.g. Pharmacist to deprescribe, GP to add statin, recheck bloods in 2 weeks"
			bind:value={p.followUpPlan}
		/>
	</Field>

	<Field label="Next review date" inputId="plan-followUpDate">
		<TextInput
			id="plan-followUpDate"
			label="Next review date"
			type="date"
			class="date-input"
			bind:value={p.followUpDate}
		/>
	</Field>

	<Field
		label="Is the review complete?"
		description="The review is graded Complete only when every required section is filled and this is Yes."
		inputId="plan-reviewCompleted"
	>
		<Select id="plan-reviewCompleted" label="Is the review complete?" bind:value={p.reviewCompleted}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
