<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Findings & Impression">
	<p class="hint">The narrative findings, the critical-organism flag, the impression, and follow-up.</p>

	<Field label="Critical / alert organism">
		<CheckboxGroup label="Critical / alert organism">
			<label>
				<CheckboxInput
					label="Critical / alert organism present (urgent communication required)"
					bind:checked={d.criticalOrganism}
				/> Critical / alert organism present (urgent communication required)
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.criticalOrganism}
		<Alert type="error" heading="Critical organism selected">
			<p>
				A critical / alert organism auto-escalates the follow-up urgency to a critical alert.
				Ensure the result is communicated to the requester on sign-off.
			</p>
		</Alert>
	{/if}

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the microbiology findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Impression" inputId="impression" required>
		<TextAreaInput
			id="impression"
			label="Impression"
			rows={4}
			placeholder="Summary impression / interpretation answering the clinical question…"
			bind:value={d.impression}
		/>
	</Field>

	<Field label="Reporting category" inputId="reportingCategory">
		<TextInput
			id="reportingCategory"
			label="Reporting category"
			placeholder="e.g. an infection-significance category"
			bind:value={d.reportingCategory}
		/>
	</Field>

	<Field label="Recommended follow-up" inputId="recommendedFollowUp">
		<TextAreaInput
			id="recommendedFollowUp"
			label="Recommended follow-up"
			rows={3}
			placeholder="Recommended follow-up testing, antimicrobial advice, or management…"
			bind:value={d.recommendedFollowUp}
		/>
	</Field>
</Fieldset>
