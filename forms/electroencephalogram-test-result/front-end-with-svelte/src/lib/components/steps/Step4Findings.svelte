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

<Fieldset legend="4. Findings">
	<p class="hint">The background rhythm, structured neurophysiological findings, and narrative.</p>

	<Field label="Background rhythm" inputId="backgroundRhythm">
		<Select id="backgroundRhythm" label="Background rhythm" bind:value={d.backgroundRhythm}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="excess-slow">Excess slow</option>
			<option value="asymmetric">Asymmetric</option>
			<option value="abnormal">Abnormal</option>
		</Select>
	</Field>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the EEG findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Epileptiform discharges" bind:checked={d.epileptiformDischarges} /> Epileptiform discharges</label>
			<label><CheckboxInput label="Focal slowing" bind:checked={d.focalSlowing} /> Focal slowing</label>
			<label><CheckboxInput label="Generalised slowing" bind:checked={d.generalisedSlowing} /> Generalised slowing</label>
			<label><CheckboxInput label="Seizure recorded" bind:checked={d.seizureRecorded} /> Seizure recorded</label>
			<label><CheckboxInput label="Status epilepticus" bind:checked={d.statusEpilepticus} /> Status epilepticus</label>
			<label><CheckboxInput label="Photoparoxysmal response" bind:checked={d.photoparoxysmalResponse} /> Photoparoxysmal response</label>
			<label><CheckboxInput label="Normal EEG" bind:checked={d.normalEeg} /> Normal EEG</label>
		</CheckboxGroup>
	</Field>

	{#if d.statusEpilepticus || d.seizureRecorded || d.epileptiformDischarges}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Status epilepticus, a recorded seizure, or epileptiform discharges auto-escalate the
				follow-up urgency to a critical alert. Ensure the result is communicated to the referrer on
				sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
