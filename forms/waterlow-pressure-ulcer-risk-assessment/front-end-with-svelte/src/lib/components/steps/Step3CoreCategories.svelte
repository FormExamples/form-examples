<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateWaterlowGrade } from '$lib/engine/waterlow-grader';
	import { options, pointsColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const s = assessment.data.core as unknown as Record<string, string>;

	const fields: { field: string; label: string }[] = [
		{ field: 'buildWeightForHeight', label: 'Build / weight for height' },
		{ field: 'skinType', label: 'Skin type / visual risk' },
		{ field: 'continence', label: 'Continence' },
		{ field: 'mobility', label: 'Mobility' }
	];

	// Core subtotal = build + skin + continence + mobility (sex and age are scored
	// on the identification step).
	const subtotal = $derived.by(() => {
		const g = calculateWaterlowGrade(assessment.data);
		return g.buildPoints + g.skinPoints + g.continencePoints + g.mobilityPoints;
	});
</script>

<Fieldset legend="Step 3 of 5 — Core risk categories">
	<p class="hint">
		Select the single option that best describes the patient for each core category. Higher points
		mean higher risk.
	</p>

	{#each fields as f (f.field)}
		<Field label={f.label} inputId={`core-${f.field}`}>
			<Select id={`core-${f.field}`} label={f.label} bind:value={s[f.field]}>
				<option value="">— Select —</option>
				{#each options[f.field] as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</Select>
		</Field>
	{/each}

	<Field label="Core subtotal">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointsColor(subtotal)}"
		>
			{subtotal} point{subtotal === 1 ? '' : 's'}
		</span>
	</Field>
</Fieldset>
