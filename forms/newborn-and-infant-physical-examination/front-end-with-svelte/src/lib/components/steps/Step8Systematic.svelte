<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import type { Systematic } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const s = assessment.data.systematic;

	// The twelve head-to-toe systematic-examination enum fields.
	type EnumKey = Exclude<keyof Systematic, 'weightGrams' | 'headCircumferenceCm' | 'lengthCm'>;
	const enumFields: { key: EnumKey; label: string }[] = [
		{ key: 'generalAppearance', label: 'General appearance' },
		{ key: 'skin', label: 'Skin' },
		{ key: 'headAndFontanelles', label: 'Head and fontanelles' },
		{ key: 'faceAndPalate', label: 'Face and palate' },
		{ key: 'neckAndClavicles', label: 'Neck and clavicles' },
		{ key: 'chestAndLungs', label: 'Chest and lungs' },
		{ key: 'abdomen', label: 'Abdomen' },
		{ key: 'genitalia', label: 'Genitalia' },
		{ key: 'anusAndSpine', label: 'Anus and spine' },
		{ key: 'limbsAndDigits', label: 'Limbs and digits' },
		{ key: 'feet', label: 'Feet' },
		{ key: 'toneAndMovement', label: 'Tone and movement' }
	];
</script>

<Fieldset legend="Step 8 of 9 — Head-to-toe systematic examination">
	<p class="hint">
		A systematic head-to-toe assessment plus measurements. These inform the record but do not change
		the four key-component results.
	</p>

	{#each enumFields as f (f.key)}
		<Field label={f.label} inputId={`systematic-${f.key}`}>
			<Select id={`systematic-${f.key}`} label={f.label} bind:value={s[f.key]}>
				<option value="">— Select —</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
				<option value="not-examined">Not examined</option>
			</Select>
		</Field>
	{/each}

	<Field label="Weight (grams)" inputId="systematic-weightGrams">
		<NumberInput
			id="systematic-weightGrams"
			label="Weight (grams)"
			min={0}
			max={8000}
			step={1}
			bind:value={s.weightGrams}
		/>
	</Field>

	<Field label="Head circumference (cm)" inputId="systematic-headCircumferenceCm">
		<NumberInput
			id="systematic-headCircumferenceCm"
			label="Head circumference (cm)"
			min={0}
			max={60}
			step={0.1}
			bind:value={s.headCircumferenceCm}
		/>
	</Field>

	<Field label="Length (cm)" inputId="systematic-lengthCm">
		<NumberInput
			id="systematic-lengthCm"
			label="Length (cm)"
			min={0}
			max={80}
			step={0.1}
			bind:value={s.lengthCm}
		/>
	</Field>
</Fieldset>
