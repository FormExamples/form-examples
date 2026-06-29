<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';

	const d = assessment.data.nailExamination;

	const colourOptions = [
		{ value: 'normal-pink', label: 'Normal pink' },
		{ value: 'pale', label: 'Pale' },
		{ value: 'cyanotic', label: 'Cyanotic / blue' },
		{ value: 'yellow', label: 'Yellow' },
		{ value: 'brown', label: 'Brown / pigmented' }
	];
	const shapeOptions = [
		{ value: 'normal', label: 'Normal (~160°)' },
		{ value: 'clubbed', label: 'Clubbed' },
		{ value: 'spoon', label: 'Spoon (koilonychia)' },
		{ value: 'beau-lines', label: 'Beau’s lines' },
		{ value: 'pitted', label: 'Pitted' }
	];
	const refillOptions = [
		{ value: 'brisk', label: 'Brisk (<2 seconds)' },
		{ value: 'normal', label: 'Normal (2-3 seconds)' },
		{ value: 'sluggish', label: 'Sluggish (>3 seconds)' },
		{ value: 'absent', label: 'Absent' }
	];
	const findingOptions = [
		{ value: 'clubbing', label: 'Clubbing' },
		{ value: 'koilonychia', label: 'Koilonychia (spoon nails)' },
		{ value: 'leukonychia', label: 'Leukonychia (white spots)' },
		{ value: 'onycholysis', label: 'Onycholysis (separation)' },
		{ value: 'paronychia', label: 'Paronychia (infection)' },
		{ value: 'onychomycosis', label: 'Onychomycosis (fungal)' },
		{ value: 'splinter-haemorrhages', label: 'Splinter haemorrhages' },
		{ value: 'beau-lines', label: 'Beau’s lines' }
	];
</script>

<Fieldset legend="Nail Examination">
	<p class="hint">Colour, shape, capillary refill, specific findings.</p>

	<Field label="Nail bed colour" inputId="nailColour">
		<Select id="nailColour" label="Nail bed colour" bind:value={d.nailColour}>
			<option value="">— Select —</option>
			{#each colourOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Nail shape / curvature" inputId="nailShape">
		<Select id="nailShape" label="Nail shape / curvature" bind:value={d.nailShape}>
			<option value="">— Select —</option>
			{#each shapeOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Capillary refill" inputId="nailCapillaryRefill">
		<Select id="nailCapillaryRefill" label="Capillary refill" bind:value={d.nailCapillaryRefill}>
			<option value="">— Select —</option>
			{#each refillOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Nail findings (tick all that apply)">
		<CheckboxGroup label="Nail findings" class="grid grid-cols-1 gap-1 sm:grid-cols-2">
			{#each findingOptions as opt (opt.value)}
				<label><input type="checkbox" class="checkbox-input" value={opt.value} bind:group={d.nailFindings} /> {opt.label}</label>
			{/each}
		</CheckboxGroup>
	</Field>

	<Field label="Nail notes" inputId="nailNotes">
		<TextAreaInput id="nailNotes" label="Nail notes" rows={2} placeholder="Any other findings…" bind:value={d.nailNotes} />
	</Field>
</Fieldset>
