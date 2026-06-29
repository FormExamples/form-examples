<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import LesionEntry from '$lib/components/ui/LesionEntry.svelte';

	const d = assessment.data.skinInspection;

	const colourOptions = [
		{ value: 'normal', label: 'Normal for ethnicity' },
		{ value: 'pale', label: 'Pale / pallor' },
		{ value: 'flushed', label: 'Flushed / erythematous' },
		{ value: 'jaundiced', label: 'Jaundiced' },
		{ value: 'cyanotic', label: 'Cyanotic' },
		{ value: 'mottled', label: 'Mottled' }
	];
	const moistureOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'dry', label: 'Dry' },
		{ value: 'very-dry', label: 'Very dry / cracked' },
		{ value: 'moist', label: 'Moist' },
		{ value: 'diaphoretic', label: 'Diaphoretic / sweaty' }
	];
	const integrityOptions = [
		{ value: 'intact', label: 'Intact' },
		{ value: 'fragile', label: 'Fragile / thin' },
		{ value: 'breakdown', label: 'Areas of breakdown' },
		{ value: 'open-lesions', label: 'Open lesions present' }
	];
	const turgorOptions = [
		{ value: 'normal', label: 'Normal — recoils quickly' },
		{ value: 'fair', label: 'Fair — slightly slow' },
		{ value: 'poor', label: 'Poor — slow' },
		{ value: 'tenting', label: 'Tenting — significantly delayed' }
	];
	const temperatureOptions = [
		{ value: 'normal', label: 'Normal / warm' },
		{ value: 'cool', label: 'Cool' },
		{ value: 'cold', label: 'Cold' },
		{ value: 'hot', label: 'Hot / febrile' }
	];
	const lesionTypeOptions = [
		{ value: 'macule', label: 'Macule (flat, <1cm)' },
		{ value: 'papule', label: 'Papule (raised, <1cm)' },
		{ value: 'plaque', label: 'Plaque (raised, >1cm)' },
		{ value: 'nodule', label: 'Nodule' },
		{ value: 'vesicle', label: 'Vesicle / blister' },
		{ value: 'pustule', label: 'Pustule' },
		{ value: 'wheal', label: 'Wheal / urticaria' },
		{ value: 'ulcer', label: 'Ulcer' },
		{ value: 'scar', label: 'Scar' },
		{ value: 'fissure', label: 'Fissure' },
		{ value: 'suspicious-pigmented', label: 'Suspicious pigmented lesion' }
	];
</script>

<Fieldset legend="Skin Inspection">
	<p class="hint">Head-to-toe inspection: colour, moisture, integrity, turgor, temperature, lesions.</p>

	<Field label="Generalised skin colour" inputId="colour">
		<Select id="colour" label="Generalised skin colour" bind:value={d.colour}>
			<option value="">— Select —</option>
			{#each colourOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Skin moisture" inputId="moisture">
		<Select id="moisture" label="Skin moisture" bind:value={d.moisture}>
			<option value="">— Select —</option>
			{#each moistureOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Skin integrity" inputId="integrity">
		<Select id="integrity" label="Skin integrity" bind:value={d.integrity}>
			<option value="">— Select —</option>
			{#each integrityOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Skin turgor" inputId="turgor">
		<Select id="turgor" label="Skin turgor" bind:value={d.turgor}>
			<option value="">— Select —</option>
			{#each turgorOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Skin temperature" inputId="temperature">
		<Select id="temperature" label="Skin temperature" bind:value={d.temperature}>
			<option value="">— Select —</option>
			{#each temperatureOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Lesion types observed (tick all that apply)">
		<CheckboxGroup label="Lesion types observed" class="grid grid-cols-1 gap-1 sm:grid-cols-2">
			{#each lesionTypeOptions as opt (opt.value)}
				<label><input type="checkbox" class="checkbox-input" value={opt.value} bind:group={d.lesionTypes} /> {opt.label}</label>
			{/each}
		</CheckboxGroup>
	</Field>

	<Field label="Specific lesions" description="Document each lesion individually with site, type, size, and description.">
		<LesionEntry bind:lesions={d.lesions} />
	</Field>

	<Field label="Additional inspection notes" inputId="additionalNotes">
		<TextAreaInput id="additionalNotes" label="Additional inspection notes" rows={3} placeholder="Any other findings…" bind:value={d.additionalNotes} />
	</Field>
</Fieldset>
