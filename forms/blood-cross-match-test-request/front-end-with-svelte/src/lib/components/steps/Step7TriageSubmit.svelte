<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

	const d = assessment.data.triage;

	const urgencyOptions = [
		{ value: 'routine', label: 'Routine' },
		{ value: 'urgent', label: 'Urgent' },
		{ value: 'emergency', label: 'Emergency' },
		{ value: 'stat', label: 'Stat' }
	];
	const settingOptions = [
		{ value: 'outpatient', label: 'Outpatient' },
		{ value: 'inpatient', label: 'Inpatient' },
		{ value: 'community', label: 'Community' },
		{ value: 'emergency', label: 'Emergency' }
	];
</script>

<Fieldset legend="Step 7 of 7 · Triage & submit">
	<p class="hint">
		Requested urgency, red flags, setting, and notes. Submit to compute the four-axis grade and flags.
	</p>

	<Field label="Requested urgency" required inputId="triage-urgency">
		<Select id="triage-urgency" label="Requested urgency" required bind:value={d.urgency}>
			<option value="">— Select —</option>
			{#each urgencyOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<h3 class="subhead">Red flags</h3>
	<label class="bool-field">
		<CheckboxInput id="triage-massiveHaemorrhage" label="Declared major / massive haemorrhage" bind:checked={d.massiveHaemorrhage} />
		<span>Declared major / massive haemorrhage</span>
	</label>
	<label class="bool-field">
		<CheckboxInput id="triage-activeUncontrolledBleeding" label="Active uncontrolled bleeding" bind:checked={d.activeUncontrolledBleeding} />
		<span>Active uncontrolled bleeding</span>
	</label>
	<label class="bool-field">
		<CheckboxInput id="triage-haemodynamicallyUnstable" label="Haemodynamically unstable" bind:checked={d.haemodynamicallyUnstable} />
		<span>Haemodynamically unstable</span>
	</label>

	<Field label="Care setting" inputId="triage-setting">
		<Select id="triage-setting" label="Care setting" bind:value={d.setting}>
			<option value="">— Select —</option>
			{#each settingOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Notes" inputId="triage-notes">
		<TextAreaInput id="triage-notes" label="Notes" rows={3} bind:value={d.notes} />
	</Field>
</Fieldset>

<style>
	.subhead {
		margin: 1rem 0 0.25rem;
		font-weight: 600;
	}
	.bool-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
