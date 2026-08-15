<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.immunologicalAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
</script>

<Fieldset legend="6. Immunological Assessment">
	<p class="hint">HLA typing, ABO compatibility, crossmatch, and panel reactive antibodies.</p>

	<div class="field-grid">
		<Field label="Donor blood group" inputId="donorBloodGroup">
			<Select id="donorBloodGroup" label="Donor blood group" bind:value={d.donorBloodGroup}>
				<option value="">-- Select --</option>
				{#each bloodGroups as g (g)}<option value={g}>{g}</option>{/each}
			</Select>
		</Field>
		<Field label="Recipient blood group" inputId="recipientBloodGroup">
			<Select id="recipientBloodGroup" label="Recipient blood group" bind:value={d.recipientBloodGroup}>
				<option value="">-- Select --</option>
				{#each bloodGroups as g (g)}<option value={g}>{g}</option>{/each}
			</Select>
		</Field>
	</div>

	<Field label="ABO compatibility" inputId="aboCompatibility">
		<Select id="aboCompatibility" label="ABO compatibility" bind:value={d.aboCompatibility}>
			<option value="">-- Select --</option>
			<option value="compatible">Compatible</option>
			<option value="incompatible">Incompatible</option>
			<option value="pending">Pending</option>
		</Select>
	</Field>

	<h3 class="sub-header">HLA antigens</h3>
	<p class="hint">Record typed alleles where known.</p>
	<div class="field-grid field-grid-3">
		<Field label="HLA-A" inputId="hlaA"><TextInput id="hlaA" label="HLA-A" bind:value={d.hlaA} /></Field>
		<Field label="HLA-B" inputId="hlaB"><TextInput id="hlaB" label="HLA-B" bind:value={d.hlaB} /></Field>
		<Field label="HLA-C" inputId="hlaC"><TextInput id="hlaC" label="HLA-C" bind:value={d.hlaC} /></Field>
		<Field label="HLA-DR" inputId="hlaDr"><TextInput id="hlaDr" label="HLA-DR" bind:value={d.hlaDr} /></Field>
		<Field label="HLA-DQ" inputId="hlaDq"><TextInput id="hlaDq" label="HLA-DQ" bind:value={d.hlaDq} /></Field>
		<Field label="HLA-DP" inputId="hlaDp"><TextInput id="hlaDp" label="HLA-DP" bind:value={d.hlaDp} /></Field>
	</div>

	<Field label="HLA match level" inputId="hlaMatchLevel">
		<Select id="hlaMatchLevel" label="HLA match level" bind:value={d.hlaMatchLevel}>
			<option value="">-- Select --</option>
			<option value="6-of-6">6/6 (Full Match)</option>
			<option value="5-of-6">5/6</option>
			<option value="4-of-6">4/6</option>
			<option value="3-of-6">3/6</option>
			<option value="2-of-6">2/6</option>
			<option value="haploidentical">Haploidentical</option>
			<option value="mismatched">Mismatched (full)</option>
		</Select>
	</Field>

	<Field label="Crossmatch result" inputId="crossmatchResult">
		<Select id="crossmatchResult" label="Crossmatch result" bind:value={d.crossmatchResult}>
			<option value="">-- Select --</option>
			<option value="compatible">Compatible</option>
			<option value="incompatible">Incompatible</option>
			<option value="pending">Pending</option>
		</Select>
	</Field>

	<Field label="PRA (Panel Reactive Antibodies) (%)" inputId="pra">
		<NumberInput id="pra" label="PRA" min={0} max={100} bind:value={d.pra} />
	</Field>

	<Field label="Donor-specific antibodies present?">
		<RadioGroup label="Donor-specific antibodies present?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="donorSpecificAntibodies" value={opt.value} bind:group={d.donorSpecificAntibodies} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.donorSpecificAntibodies === 'yes'}
		<Field label="DSA details" inputId="dsaDetails">
			<TextAreaInput id="dsaDetails" label="DSA details" rows={2} placeholder="Antibody specificities, MFI levels, history…" bind:value={d.dsaDetails} />
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
	.sub-header {
		margin: 1.25rem 0 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
	}
</style>
