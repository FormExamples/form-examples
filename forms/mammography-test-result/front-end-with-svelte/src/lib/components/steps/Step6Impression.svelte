<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import { isBiRadsUrgent, isBiRadsCritical } from '#lib/engine/utils.js';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Impression">
	<p class="hint">The summary impression, the ACR BI-RADS final assessment, and recommended follow-up.</p>

	<Field label="Impression" inputId="impression" required>
		<TextAreaInput
			id="impression"
			label="Impression"
			rows={4}
			placeholder="Summary impression / conclusion answering the clinical question…"
			bind:value={d.impression}
		/>
	</Field>

	<Field
		label="BI-RADS final assessment category"
		inputId="biRadsCategory"
		description="The key structured score. Only 0/1/2 are valid for a screening study; 3/4/5/6 require a complete diagnostic work-up."
		required
	>
		<Select id="biRadsCategory" label="BI-RADS final assessment category" bind:value={d.biRadsCategory} required>
			<option value="">Select…</option>
			<option value="0">0 — incomplete (need additional imaging)</option>
			<option value="1">1 — negative</option>
			<option value="2">2 — benign</option>
			<option value="3">3 — probably benign</option>
			<option value="4a">4a — suspicious (low)</option>
			<option value="4b">4b — suspicious (intermediate)</option>
			<option value="4c">4c — suspicious (moderate)</option>
			<option value="5">5 — highly suggestive of malignancy</option>
			<option value="6">6 — known biopsy-proven malignancy</option>
		</Select>
	</Field>

	{#if isBiRadsCritical(d.biRadsCategory)}
		<Alert type="error" heading="Critical BI-RADS category selected">
			<p>
				BI-RADS {d.biRadsCategory} (≥ 50 % likelihood of malignancy) auto-escalates the follow-up
				urgency to a critical alert. Communicate the result to the referrer and record it on sign-off.
			</p>
		</Alert>
	{:else if isBiRadsUrgent(d.biRadsCategory)}
		<Alert type="warning" heading="Suspicious BI-RADS category selected">
			<p>
				BI-RADS {d.biRadsCategory} is suspicious and raises an urgent two-week-wait (2WW) biopsy
				referral. Arrange tissue diagnosis.
			</p>
		</Alert>
	{/if}

	<Field label="Recommended follow-up" inputId="recommendedFollowUp">
		<TextAreaInput
			id="recommendedFollowUp"
			label="Recommended follow-up"
			rows={3}
			placeholder="Routine screening interval, short-interval follow-up, additional imaging, biopsy, or referral…"
			bind:value={d.recommendedFollowUp}
		/>
	</Field>
</Fieldset>
