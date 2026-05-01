<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const e = assessment.data.exposureAndFast;

	const peritoneumOptions = [
		{ value: 'negative', label: 'Negative' },
		{ value: 'indeterminate', label: 'Indeterminate' },
		{ value: 'free-fluid', label: 'Free fluid' }
	];

	const chestOptions = [
		{ value: 'negative', label: 'Negative' },
		{ value: 'indeterminate', label: 'Indeterminate' },
		{ value: 'pneumothorax', label: 'Pneumothorax' },
		{ value: 'pleural-fluid', label: 'Pleural fluid' },
		{ value: 'pericardial-effusion', label: 'Pericardial effusion' }
	];

	const sideOptions = [
		{ value: 'left', label: 'L' },
		{ value: 'right', label: 'R' },
		{ value: 'bilateral', label: 'Bilateral' }
	];
</script>

<SectionCard
	title="Exposure (E) & FAST (F)"
	description="Exposure (full undressing) and Focused Assessment with Sonography for Trauma."
>
	<h3 class="mb-2 text-base font-semibold text-gray-800">Exposure</h3>
	<Checkbox label="Patient exposed completely" name="exposedCompletely" bind:checked={e.exposedCompletely} />
	<TextArea label="Exposure notes" name="exposureNotes" bind:value={e.exposureNotes} rows={2} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">FAST</h3>
	<Checkbox label="Normal (no abnormal findings)" name="fastNormal" bind:checked={e.fastNormal} />
	<Checkbox label="Not indicated" name="fastNotIndicated" bind:checked={e.fastNotIndicated} />
	<Checkbox label="Not available" name="fastNotAvailable" bind:checked={e.fastNotAvailable} />

	<RadioGroup
		label="Peritoneum"
		name="fastPeritoneum"
		options={peritoneumOptions}
		bind:value={e.fastPeritoneum}
	/>

	<RadioGroup
		label="Chest"
		name="fastChest"
		options={chestOptions}
		bind:value={e.fastChest}
	/>

	{#if e.fastChest === 'pneumothorax'}
		<RadioGroup
			label="Pneumothorax side"
			name="fastChestPneumothoraxSide"
			options={sideOptions}
			bind:value={e.fastChestPneumothoraxSide}
		/>
	{/if}

	{#if e.fastChest === 'pleural-fluid'}
		<RadioGroup
			label="Pleural fluid side"
			name="fastChestPleuralFluidSide"
			options={sideOptions}
			bind:value={e.fastChestPleuralFluidSide}
		/>
	{/if}

	<TextArea label="FAST notes" name="fastNotes" bind:value={e.fastNotes} rows={2} />
</SectionCard>
