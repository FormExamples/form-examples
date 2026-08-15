<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Identity & Overall Result">
	<p class="hint">The two-sample group-check rule, the overall result status, the findings narrative, and the impression.</p>

	<Field label="Two-sample (group-check) rule">
		<CheckboxGroup label="Two-sample (group-check) rule">
			<label>
				<CheckboxInput
					label="The BSH / SHOT two-sample group-check rule was satisfied before issue"
					bind:checked={d.twoSampleRuleMet}
				/> The BSH / SHOT two-sample group-check rule was satisfied before issue
			</label>
		</CheckboxGroup>
	</Field>

	{#if !d.twoSampleRuleMet && (d.aboGroup !== '' || d.crossmatchResult !== '')}
		<Alert type="error" heading="Two-sample rule not met">
			<p>
				The two-sample group-check rule has not been satisfied. This auto-escalates the follow-up
				urgency to a critical alert. Obtain a second valid group-check sample before issue.
			</p>
		</Alert>
	{/if}

	<Field label="Overall result status" inputId="overallResultStatus">
		<Select id="overallResultStatus" label="Overall result status" bind:value={d.overallResultStatus}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="critical">Critical</option>
		</Select>
	</Field>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the laboratory findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Impression" inputId="impression" required>
		<TextAreaInput
			id="impression"
			label="Impression"
			rows={4}
			placeholder="Summary impression / conclusion answering the compatibility question…"
			bind:value={d.impression}
		/>
	</Field>

	<Field label="Recommended follow-up" inputId="recommendedFollowUp">
		<TextAreaInput
			id="recommendedFollowUp"
			label="Recommended follow-up"
			rows={3}
			placeholder="Repeat sample, further investigation, referral, or issue instructions…"
			bind:value={d.recommendedFollowUp}
		/>
	</Field>
</Fieldset>
