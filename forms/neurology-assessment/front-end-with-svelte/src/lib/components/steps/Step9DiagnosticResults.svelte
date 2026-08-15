<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.diagnosticResults;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Diagnostic Results">
	<p class="hint">Imaging, EEG, EMG/NCS, and lumbar puncture findings.</p>

	<Field label="Has MRI/CT brain been performed?">
		<RadioGroup label="MRI/CT performed">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="mriCt" value={opt.value} bind:group={d.mriCtPerformed} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.mriCtPerformed === 'yes'}
		<Field label="MRI/CT finding" inputId="mriCtFinding">
			<Select id="mriCtFinding" label="MRI/CT finding" bind:value={d.mriCtFinding}>
				<option value="">-- Select --</option>
				<option value="normal">Normal</option>
				<option value="infarct">Infarct</option>
				<option value="haemorrhage">Haemorrhage</option>
				<option value="mass">Mass/tumour</option>
				<option value="demyelination">Demyelination</option>
				<option value="atrophy">Atrophy</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Imaging details" inputId="mriCtDetails">
			<TextAreaInput id="mriCtDetails" label="MRI/CT details" rows={2} placeholder="Location, size, and clinical correlation" bind:value={d.mriCtDetails} />
		</Field>
	{/if}

	<Field label="Has EEG been performed?">
		<RadioGroup label="EEG performed">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="eeg" value={opt.value} bind:group={d.eegPerformed} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.eegPerformed === 'yes'}
		<Field label="EEG finding" inputId="eegFinding">
			<Select id="eegFinding" label="EEG finding" bind:value={d.eegFinding}>
				<option value="">-- Select --</option>
				<option value="normal">Normal</option>
				<option value="epileptiform">Epileptiform discharges</option>
				<option value="slow-wave">Generalised slowing</option>
				<option value="focal-abnormality">Focal abnormality</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="EEG details" inputId="eegDetails">
			<TextAreaInput id="eegDetails" label="EEG details" rows={2} bind:value={d.eegDetails} />
		</Field>
	{/if}

	<Field label="Has EMG/nerve conduction study been performed?">
		<RadioGroup label="EMG/NCS performed">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="emgNcs" value={opt.value} bind:group={d.emgNcsPerformed} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.emgNcsPerformed === 'yes'}
		<Field label="EMG/NCS findings" inputId="emgNcsDetails">
			<TextAreaInput id="emgNcsDetails" label="EMG/NCS details" rows={2} placeholder="e.g., demyelinating neuropathy..." bind:value={d.emgNcsDetails} />
		</Field>
	{/if}

	<Field label="Has lumbar puncture been performed?">
		<RadioGroup label="LP performed">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="lp" value={opt.value} bind:group={d.lumbarPuncturePerformed} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.lumbarPuncturePerformed === 'yes'}
		<Field label="Lumbar puncture findings" inputId="lpDetails">
			<TextAreaInput id="lpDetails" label="LP details" rows={2} placeholder="e.g., opening pressure, CSF analysis..." bind:value={d.lumbarPunctureDetails} />
		</Field>
	{/if}
</Fieldset>
