<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const img = assessment.data.imagingHistory;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Imaging History">
	<p class="hint">Previous imaging studies related to your orthopedic condition.</p>

	<h3 class="step-subhead">X-Ray</h3>
	<Field label="Has an X-ray been performed?">
		<RadioGroup label="X-ray performed">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="xRayPerformed" value={opt.value} bind:group={img.xRay.performed} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if img.xRay.performed === 'yes'}
		<Field label="Date" inputId="xRayDate">
			<DateInput id="xRayDate" label="X-ray date" bind:value={img.xRay.date} />
		</Field>
		<Field label="Findings" inputId="xRayFindings">
			<TextAreaInput id="xRayFindings" label="X-ray findings" rows={3} bind:value={img.xRay.findings} />
		</Field>
	{/if}

	<h3 class="step-subhead">MRI</h3>
	<Field label="Has an MRI been performed?">
		<RadioGroup label="MRI performed">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="mriPerformed" value={opt.value} bind:group={img.mri.performed} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if img.mri.performed === 'yes'}
		<Field label="Date" inputId="mriDate">
			<DateInput id="mriDate" label="MRI date" bind:value={img.mri.date} />
		</Field>
		<Field label="Findings" inputId="mriFindings">
			<TextAreaInput id="mriFindings" label="MRI findings" rows={3} bind:value={img.mri.findings} />
		</Field>
	{/if}

	<h3 class="step-subhead">CT Scan</h3>
	<Field label="Has a CT scan been performed?">
		<RadioGroup label="CT scan performed">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="ctScanPerformed" value={opt.value} bind:group={img.ctScan.performed} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if img.ctScan.performed === 'yes'}
		<Field label="Date" inputId="ctScanDate">
			<DateInput id="ctScanDate" label="CT scan date" bind:value={img.ctScan.date} />
		</Field>
		<Field label="Findings" inputId="ctScanFindings">
			<TextAreaInput id="ctScanFindings" label="CT scan findings" rows={3} bind:value={img.ctScan.findings} />
		</Field>
	{/if}

	<h3 class="step-subhead">Ultrasound</h3>
	<Field label="Has an ultrasound been performed?">
		<RadioGroup label="Ultrasound performed">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="ultrasoundPerformed" value={opt.value} bind:group={img.ultrasound.performed} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if img.ultrasound.performed === 'yes'}
		<Field label="Date" inputId="ultrasoundDate">
			<DateInput id="ultrasoundDate" label="Ultrasound date" bind:value={img.ultrasound.date} />
		</Field>
		<Field label="Findings" inputId="ultrasoundFindings">
			<TextAreaInput id="ultrasoundFindings" label="Ultrasound findings" rows={3} bind:value={img.ultrasound.findings} />
		</Field>
	{/if}
</Fieldset>

<style>
	.step-subhead {
		font-size: 1rem;
		font-weight: 600;
		margin: 1.25rem 0 0.5rem;
	}
</style>
