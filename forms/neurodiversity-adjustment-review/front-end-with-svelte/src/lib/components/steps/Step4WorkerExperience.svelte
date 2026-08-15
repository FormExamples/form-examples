<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;

	const showWellbeing = $derived(d.workerSatisfied === 'no' || d.wellbeingChange === 'worse');
</script>

<Fieldset legend="4. Worker Experience">
	<p class="hint">
		The worker's own account of how the adjustments are working, whether they are satisfied, any
		change in their wellbeing, and any remaining barriers.
	</p>

	<Field
		label="Worker feedback"
		inputId="workerFeedback"
		description="The worker's own feedback on how the adjustments are working."
	>
		<TextAreaInput
			id="workerFeedback"
			label="Worker feedback"
			rows={5}
			placeholder="e.g. The quiet desk and headphones make a real difference; I can focus far better now…"
			bind:value={d.workerFeedback}
		/>
	</Field>

	<Field
		label="Is the worker satisfied the adjustments meet their needs?"
		inputId="workerSatisfied"
	>
		<Select id="workerSatisfied" label="Worker satisfied" bind:value={d.workerSatisfied}>
			<option value="">Select…</option>
			<option value="yes">Yes — satisfied</option>
			<option value="partially">Partially satisfied</option>
			<option value="no">No — not satisfied</option>
		</Select>
	</Field>

	<Field
		label="Change in the worker's wellbeing since the adjustments"
		inputId="wellbeingChange"
	>
		<Select id="wellbeingChange" label="Wellbeing change" bind:value={d.wellbeingChange}>
			<option value="">Select…</option>
			<option value="improved">Improved</option>
			<option value="unchanged">Unchanged</option>
			<option value="worse">Worse</option>
		</Select>
	</Field>

	<Field
		label="Remaining barriers"
		inputId="barriersDetail"
		description="Any barriers or difficulties the worker still experiences."
	>
		<TextAreaInput
			id="barriersDetail"
			label="Remaining barriers"
			rows={3}
			placeholder="e.g. The promised desk move never happened and the open-plan noise is still difficult…"
			bind:value={d.barriersDetail}
		/>
	</Field>

	{#if showWellbeing}
		<Alert type="warning" heading="Wellbeing risk">
			<p>
				A dissatisfied worker or declining wellbeing drives the wellbeing-risk axis to high risk and
				raises the corresponding flag. Explore what would work with the worker and consider
				occupational-health input.
			</p>
		</Alert>
	{/if}
</Fieldset>
