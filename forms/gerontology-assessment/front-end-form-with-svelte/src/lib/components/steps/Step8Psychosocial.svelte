<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.psychosocial;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Psychosocial">
	<p class="hint">Depression screening, social isolation, caregiver status, and advance directives.</p>

	<Field label="Depression Screen (GDS-15) Result" inputId="depressionScreen">
		<Select id="depressionScreen" label="Depression Screen" bind:value={p.depressionScreen}>
			<option value="">-- Select --</option>
			<option value="normal">Normal (0-4)</option>
			<option value="mild">Mild depression (5-8)</option>
			<option value="moderate">Moderate depression (9-11)</option>
			<option value="severe">Severe depression (12-15)</option>
		</Select>
	</Field>

	<Field label="GDS-15 Score" inputId="gds15Score"><NumberInput id="gds15Score" label="GDS-15 Score" min={0} max={15} bind:value={p.gds15Score} /></Field>

	<Field label="Social Isolation Level" inputId="socialIsolation">
		<Select id="socialIsolation" label="Social Isolation" bind:value={p.socialIsolation}>
			<option value="">-- Select --</option>
			<option value="none">No isolation - regular social contact</option>
			<option value="mild">Mild - some social contact</option>
			<option value="moderate">Moderate - limited social contact</option>
			<option value="severe">Severe - very isolated, minimal contact</option>
		</Select>
	</Field>

	<Field label="Does the patient have a caregiver?">
		<RadioGroup label="Has caregiver">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="hasCaregiver" value={opt.value} bind:group={p.hasCaregiver} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if p.hasCaregiver === 'yes'}
		<Field label="Caregiver details" inputId="caregiverDetails"><TextAreaInput id="caregiverDetails" label="Caregiver details" rows={3} placeholder="e.g., spouse, adult child, paid carer, hours per week" bind:value={p.caregiverDetails} /></Field>
	{/if}

	<Field label="Are there any advance directives, DNAR, or living wills in place?">
		<RadioGroup label="Advance directives">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="advanceDirectives" value={opt.value} bind:group={p.advanceDirectives} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if p.advanceDirectives === 'yes'}
		<Field label="Advance directive details" inputId="advanceDirectiveDetails"><TextAreaInput id="advanceDirectiveDetails" label="Advance directive details" rows={3} placeholder="e.g., DNAR, power of attorney, treatment preferences" bind:value={p.advanceDirectiveDetails} /></Field>
	{/if}
</Fieldset>
