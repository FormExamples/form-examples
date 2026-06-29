<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const rom = assessment.data.rangeOfMotion;

	const romOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'mildly-limited', label: 'Mildly limited' },
		{ value: 'moderately-limited', label: 'Moderately limited' },
		{ value: 'severely-limited', label: 'Severely limited' }
	];
</script>

<Fieldset legend="Range of Motion - Hip">
	<div class="field-grid">
		<Field label="Hip Flexion" inputId="hipFlexion">
			<Select id="hipFlexion" label="Hip Flexion" bind:value={rom.hipFlexion}>
				<option value="">-- Select --</option>
				{#each romOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Hip Extension" inputId="hipExtension">
			<Select id="hipExtension" label="Hip Extension" bind:value={rom.hipExtension}>
				<option value="">-- Select --</option>
				{#each romOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
	</div>
</Fieldset>

<Fieldset legend="Range of Motion - Knee">
	<div class="field-grid">
		<Field label="Knee Flexion" inputId="kneeFlexion">
			<Select id="kneeFlexion" label="Knee Flexion" bind:value={rom.kneeFlexion}>
				<option value="">-- Select --</option>
				{#each romOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Knee Extension" inputId="kneeExtension">
			<Select id="kneeExtension" label="Knee Extension" bind:value={rom.kneeExtension}>
				<option value="">-- Select --</option>
				{#each romOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
	</div>
</Fieldset>

<Fieldset legend="Range of Motion - Ankle">
	<div class="field-grid">
		<Field label="Ankle Dorsiflexion" inputId="ankleFlexion">
			<Select id="ankleFlexion" label="Ankle Dorsiflexion" bind:value={rom.ankleFlexion}>
				<option value="">-- Select --</option>
				{#each romOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Ankle Plantarflexion" inputId="ankleExtension">
			<Select id="ankleExtension" label="Ankle Plantarflexion" bind:value={rom.ankleExtension}>
				<option value="">-- Select --</option>
				{#each romOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<Field label="Additional ROM Notes" inputId="romNotes">
		<TextAreaInput id="romNotes" label="ROM Notes" rows={3} placeholder="Any additional observations about range of motion..." bind:value={rom.notes} />
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
