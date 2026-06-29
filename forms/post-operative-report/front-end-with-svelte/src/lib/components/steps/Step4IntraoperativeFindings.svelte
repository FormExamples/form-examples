<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.intraoperativeFindings;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Intra-operative Findings">
	<p class="hint">Findings and procedure performed in theatre.</p>

	<Field label="Findings" inputId="findings">
		<TextAreaInput id="findings" label="Findings" rows={4} placeholder="Anatomical findings, pathology encountered, etc." bind:value={d.findings} />
	</Field>

	<Field label="Procedure performed" inputId="procedurePerformed">
		<TextAreaInput id="procedurePerformed" label="Procedure performed" rows={4} placeholder="Detailed description of what was actually done." bind:value={d.procedurePerformed} />
	</Field>

	<Field label="Unexpected findings" inputId="unexpectedFindings">
		<TextAreaInput id="unexpectedFindings" label="Unexpected findings" rows={3} placeholder="Any deviation from the planned procedure." bind:value={d.unexpectedFindings} />
	</Field>

	<Field label="Conversion to open procedure?">
		<RadioGroup label="Conversion to open procedure?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="conversionToOpen" value={opt.value} bind:group={d.conversionToOpen} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.conversionToOpen === 'yes'}
		<Field label="Reason for conversion" inputId="conversionReason">
			<TextAreaInput id="conversionReason" label="Reason for conversion" rows={2} placeholder="Why was the procedure converted?" bind:value={d.conversionReason} />
		</Field>
	{/if}
</Fieldset>
