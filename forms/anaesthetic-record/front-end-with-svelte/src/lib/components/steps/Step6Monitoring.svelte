<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';

	const m = $state(assessment.data.monitoring);

	const options = [
		{ value: 'ecg', label: 'ECG' },
		{ value: 'nibp', label: 'NIBP' },
		{ value: 'arterial-line', label: 'Arterial line' },
		{ value: 'spo2', label: 'SpO2' },
		{ value: 'capnography', label: 'Capnography' },
		{ value: 'temperature', label: 'Temperature' },
		{ value: 'neuromuscular', label: 'Neuromuscular' },
		{ value: 'depth-of-anaesthesia', label: 'Depth of anaesthesia' },
		{ value: 'cvp', label: 'CVP' },
		{ value: 'urine-output', label: 'Urine output' }
	];
</script>

<Fieldset legend="Step 6 of 12 — Monitoring">
	<p class="hint">
		Select every monitoring modality in use during the anaesthetic — recorded for a complete record.
	</p>

	<CheckboxGroup label="Monitoring modalities">
		{#each options as opt (opt.value)}
			<label class="checkbox-option">
				<input
					class="checkbox-input"
					type="checkbox"
					value={opt.value}
					bind:group={m.monitoringModalities}
				/>
				<span>{opt.label}</span>
			</label>
		{/each}
	</CheckboxGroup>
</Fieldset>
