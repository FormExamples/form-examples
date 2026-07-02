<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const e = assessment.data.eligibility;
</script>

<Fieldset legend="Step 3 of 9 — Eligibility">
	<p class="hint">
		Recall interval, screen-due date, and whether the person is overdue or has formally ceased
		screening. A ceased record ends the pathway with no recall.
	</p>

	<Field label="Recall interval" inputId="eligibility-recallInterval">
		<Select id="eligibility-recallInterval" label="Recall interval" bind:value={e.recallInterval}>
			<option value="">— Select —</option>
			<option value="three-yearly">3-yearly (ages 25-49)</option>
			<option value="five-yearly">5-yearly (ages 50-64)</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Screen-due date" inputId="eligibility-screenDueDate">
		<TextInput
			id="eligibility-screenDueDate"
			label="Screen-due date"
			type="date"
			class="date-input"
			bind:value={e.screenDueDate}
		/>
	</Field>

	<Field label="Last screen date" inputId="eligibility-lastScreenDate">
		<TextInput
			id="eligibility-lastScreenDate"
			label="Last screen date"
			type="date"
			class="date-input"
			bind:value={e.lastScreenDate}
		/>
	</Field>

	<Field label="Overdue for screening" inputId="eligibility-overdue">
		<Select id="eligibility-overdue" label="Overdue for screening" bind:value={e.overdue}>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>

	<Field label="Previously ceased screening" inputId="eligibility-previouslyCeased">
		<Select
			id="eligibility-previouslyCeased"
			label="Previously ceased screening"
			bind:value={e.previouslyCeased}
		>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>
</Fieldset>
