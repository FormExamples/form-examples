<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const q = assessment.data.sampleQuality;
</script>

<Fieldset legend="Step 5 of 7 — Sample quality">
	<p class="hint">
		Adequacy and any spot-quality issue. An inadequate sample or a spot-quality issue means the
		card cannot be reliably screened and a repeat is required.
	</p>

	<Field label="Sample adequacy" inputId="sampleQuality-sampleAdequacy">
		<Select
			id="sampleQuality-sampleAdequacy"
			label="Sample adequacy"
			bind:value={q.sampleAdequacy}
		>
			<option value="">— Select —</option>
			<option value="adequate">Adequate</option>
			<option value="inadequate">Inadequate</option>
		</Select>
	</Field>

	<Field label="Spot-quality issue" inputId="sampleQuality-spotQualityIssue">
		<Select
			id="sampleQuality-spotQualityIssue"
			label="Spot-quality issue"
			bind:value={q.spotQualityIssue}
		>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="insufficient">Insufficient blood</option>
			<option value="compressed">Compressed / squeezed spot</option>
			<option value="layered">Layered spot</option>
			<option value="contaminated">Contaminated</option>
			<option value="incomplete-circles">Incomplete circles</option>
		</Select>
	</Field>

	<Field label="Is this a repeat sample?" inputId="sampleQuality-isRepeat">
		<Select id="sampleQuality-isRepeat" label="Is this a repeat sample?" bind:value={q.isRepeat}>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>

	<Field label="Repeat reason" inputId="sampleQuality-repeatReason">
		<Select id="sampleQuality-repeatReason" label="Repeat reason" bind:value={q.repeatReason}>
			<option value="">— Select —</option>
			<option value="not-applicable">Not applicable</option>
			<option value="borderline-result">Borderline result</option>
			<option value="inadequate-sample">Inadequate sample</option>
			<option value="too-early">Taken too early</option>
			<option value="technical">Technical / card fault</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
