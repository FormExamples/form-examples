<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';
	import { isSevereAhi } from '$lib/engine/utils';

	const d = resultStore.data;

	const criticalSelected = $derived(
		(isSevereAhi(d) && d.significantDesaturation) || d.nocturnalHypoventilation
	);
</script>

<Fieldset legend="5. Findings">
	<p class="hint">OSA severity, structured finding flags, and the narrative findings.</p>

	<Field
		label="OSA severity"
		inputId="osaSeverity"
		description="AASM band derived from AHI: none <5, mild 5 to <15, moderate 15 to <30, severe >=30."
	>
		<Select id="osaSeverity" label="OSA severity" bind:value={d.osaSeverity}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Obstructive sleep apnoea" bind:checked={d.obstructiveSleepApnoea} /> Obstructive sleep apnoea</label>
			<label><CheckboxInput label="Central sleep apnoea" bind:checked={d.centralSleepApnoea} /> Central sleep apnoea</label>
			<label><CheckboxInput label="Periodic limb movements" bind:checked={d.periodicLimbMovements} /> Periodic limb movements</label>
			<label><CheckboxInput label="Nocturnal hypoventilation" bind:checked={d.nocturnalHypoventilation} /> Nocturnal hypoventilation</label>
			<label><CheckboxInput label="Significant desaturation" bind:checked={d.significantDesaturation} /> Significant desaturation</label>
			<label><CheckboxInput label="Normal study" bind:checked={d.normalStudy} /> Normal study</label>
		</CheckboxGroup>
	</Field>

	{#if criticalSelected}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Severe OSA with significant desaturation, or nocturnal hypoventilation, auto-escalates the
				follow-up urgency to a critical alert and triggers an urgent CPAP / ventilation review.
				Ensure the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the study findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>
</Fieldset>
