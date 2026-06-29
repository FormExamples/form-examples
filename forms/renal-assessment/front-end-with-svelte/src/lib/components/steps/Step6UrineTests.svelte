<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { classifyAlbuminuriaCategory, albuminuriaCategoryLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const u = assessment.data.urineTests;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const dipstick = ['negative', 'trace', '1+', '2+', '3+', '4+'];
	const albCat = $derived(classifyAlbuminuriaCategory(u.acr));
</script>

<Fieldset legend="Urine Tests">
	<p class="hint">Urinary albumin / protein quantification and dipstick analysis.</p>

	<div class="field-grid field-grid-3">
		<Field label="Urine ACR (mg/mmol)" inputId="acr">
			<NumberInput id="acr" label="Urine ACR" min={0} max={1000} step={0.1} bind:value={u.acr} />
		</Field>
		<Field label="Urine PCR (mg/mmol)" inputId="pcr">
			<NumberInput id="pcr" label="Urine PCR" min={0} max={1000} step={0.1} bind:value={u.pcr} />
		</Field>
		<Field label="Albuminuria category" description="Auto from ACR">
			{#if albCat}
				<p class="readout">{albCat} <span class="readout-muted">{albuminuriaCategoryLabel(albCat)}</span></p>
			{:else}
				<p class="readout readout-empty">—</p>
			{/if}
		</Field>
	</div>

	<h3 class="subheading">Urine dipstick</h3>

	<Field label="Protein" inputId="dipstickProtein">
		<Select id="dipstickProtein" label="Protein" bind:value={u.dipstickProtein}>
			<option value="">— Select —</option>
			{#each dipstick as v (v)}<option value={v}>{v === 'negative' ? 'Negative' : v === 'trace' ? 'Trace' : v}</option>{/each}
		</Select>
	</Field>
	<Field label="Blood" inputId="dipstickBlood">
		<Select id="dipstickBlood" label="Blood" bind:value={u.dipstickBlood}>
			<option value="">— Select —</option>
			{#each dipstick as v (v)}<option value={v}>{v === 'negative' ? 'Negative' : v === 'trace' ? 'Trace' : v}</option>{/each}
		</Select>
	</Field>
	<Field label="Glucose" inputId="dipstickGlucose">
		<Select id="dipstickGlucose" label="Glucose" bind:value={u.dipstickGlucose}>
			<option value="">— Select —</option>
			{#each dipstick as v (v)}<option value={v}>{v === 'negative' ? 'Negative' : v === 'trace' ? 'Trace' : v}</option>{/each}
		</Select>
	</Field>
	<Field label="Leukocytes" inputId="dipstickLeukocytes">
		<Select id="dipstickLeukocytes" label="Leukocytes" bind:value={u.dipstickLeukocytes}>
			<option value="">— Select —</option>
			{#each dipstick as v (v)}<option value={v}>{v === 'negative' ? 'Negative' : v === 'trace' ? 'Trace' : v}</option>{/each}
		</Select>
	</Field>
	<Field label="Nitrites" inputId="dipstickNitrites">
		<Select id="dipstickNitrites" label="Nitrites" bind:value={u.dipstickNitrites}>
			<option value="">— Select —</option>
			<option value="negative">Negative</option>
			<option value="positive">Positive</option>
		</Select>
	</Field>

	<Field label="Microscopy: urinary casts present?">
		<RadioGroup label="Microscopy: urinary casts present?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="casts" value={opt.value} bind:group={u.microscopyCasts} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if u.microscopyCasts === 'yes'}
		<Field label="Predominant cast type" inputId="castType">
			<Select id="castType" label="Predominant cast type" bind:value={u.castType}>
				<option value="">— Select —</option>
				<option value="hyaline">Hyaline</option>
				<option value="granular">Granular</option>
				<option value="red-cell">Red-cell</option>
				<option value="white-cell">White-cell</option>
				<option value="fatty">Fatty</option>
				<option value="waxy">Waxy</option>
			</Select>
		</Field>
	{/if}

	<Field label="Urine test date" inputId="urineTestDate">
		<DateInput id="urineTestDate" label="Urine test date" bind:value={u.testDate} />
	</Field>
</Fieldset>

<style>
	.field-grid-3 {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
	.subheading {
		margin: 1rem 0 0.25rem;
		font-size: 1rem;
		font-weight: 600;
	}
	.readout {
		margin: 0;
		font-weight: 500;
	}
	.readout-muted {
		color: var(--color-muted);
		font-weight: 400;
	}
	.readout-empty {
		color: var(--color-muted);
	}
</style>
