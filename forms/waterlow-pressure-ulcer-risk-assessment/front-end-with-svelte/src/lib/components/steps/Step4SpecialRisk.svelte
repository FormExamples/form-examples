<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateWaterlowGrade } from '$lib/engine/waterlow-grader';
	import { options, pointsColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.special as unknown as Record<string, string>;

	const fields: { field: string; label: string }[] = [
		{ field: 'tissueMalnutrition', label: 'Tissue malnutrition' },
		{ field: 'neurologicalDeficit', label: 'Neurological deficit' },
		{ field: 'majorSurgeryTrauma', label: 'Major surgery or trauma' },
		{ field: 'medication', label: 'Medication' }
	];

	const yesNo = [
		{ value: 'no', label: 'No' },
		{ value: 'yes', label: 'Yes' }
	];

	// Special-risk subtotal = tissue malnutrition + neurological + surgery + medication.
	const subtotal = $derived.by(() => {
		const g = calculateWaterlowGrade(assessment.data);
		return (
			g.tissueMalnutritionPoints +
			g.neurologicalDeficitPoints +
			g.majorSurgeryTraumaPoints +
			g.medicationPoints
		);
	});
</script>

<Fieldset legend="Step 4 of 5 — Special-risk groups">
	<p class="hint">
		Select the highest applicable option in each special-risk group, then record whether pressure
		damage is already present.
	</p>

	{#each fields as f (f.field)}
		<Field label={f.label} inputId={`special-${f.field}`}>
			<Select id={`special-${f.field}`} label={f.label} bind:value={s[f.field]}>
				<option value="">— Select —</option>
				{#each options[f.field] as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</Select>
		</Field>
	{/each}

	<Field
		label="Existing pressure damage?"
		description="Discoloured or broken skin, or a recorded pressure ulcer. Does not add points but raises a red flag."
	>
		<RadioGroup label="Existing pressure damage?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="special-existingPressureDamage"
						value={opt.value}
						bind:group={s.existingPressureDamage}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Special-risk subtotal">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointsColor(subtotal)}"
		>
			{subtotal} point{subtotal === 1 ? '' : 's'}
		</span>
	</Field>
</Fieldset>
