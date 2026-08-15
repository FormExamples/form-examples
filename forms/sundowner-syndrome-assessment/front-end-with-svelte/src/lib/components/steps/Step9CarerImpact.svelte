<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.carerImpact;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const flags: { key: 'carerSleepDisturbed' | 'carerBurnoutSigns' | 'respiteCareInPlace' | 'formalSupportEngaged'; label: string }[] = [
		{ key: 'carerSleepDisturbed', label: 'Carer sleep disturbed?' },
		{ key: 'carerBurnoutSigns', label: 'Signs of carer burnout?' },
		{ key: 'respiteCareInPlace', label: 'Respite care in place?' },
		{ key: 'formalSupportEngaged', label: 'Formal support engaged?' }
	];
</script>

<Fieldset legend="Carer Impact & Support">
	<p class="hint">Impact on the primary carer and available support.</p>

	<div class="field-grid">
		<Field label="Primary carer" inputId="primaryCarer">
			<TextInput id="primaryCarer" label="Primary carer" bind:value={c.primaryCarer} />
		</Field>
		<Field label="Relationship to patient" inputId="carerRelationship">
			<TextInput id="carerRelationship" label="Relationship to patient" bind:value={c.carerRelationship} />
		</Field>
	</div>

	<Field label="Carer strain level" inputId="carerStrainLevel">
		<Select id="carerStrainLevel" label="Carer strain level" bind:value={c.carerStrainLevel}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="minimal">Minimal</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<div class="field-grid">
		{#each flags as flag (flag.key)}
			<Field label={flag.label}>
				<RadioGroup label={flag.label}>
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name={flag.key} value={opt.value} bind:group={c[flag.key]} /> {opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
		{/each}
	</div>

	<Field label="Carer notes" inputId="carerNotes">
		<TextAreaInput id="carerNotes" label="Carer notes" rows={3} bind:value={c.carerNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem 1.5rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
