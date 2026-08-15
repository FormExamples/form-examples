<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculatePaduaGrade } from '#lib/engine/padua-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.mobility;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const subtotal = $derived(() => {
		const fp = calculatePaduaGrade(assessment.data).factorPoints;
		return (fp.reducedMobility ?? 0) + (fp.recentTraumaOrSurgery ?? 0);
	});
</script>

<Fieldset legend="Step 4 of 8 — Mobility and recent events">
	<p class="hint">
		Reduced mobility scores 3 points; recent trauma or surgery scores 2 points.
	</p>

	<Field label="Reduced mobility? (bed rest with bathroom privileges for at least 3 days)">
		<p class="hint">Factor 3 — 3 points when present.</p>
		<RadioGroup label="Reduced mobility?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="mobility-reducedMobility"
						value={opt.value}
						bind:group={m.reducedMobility}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Recent trauma or surgery? (within the last month)">
		<p class="hint">Factor 5 — 2 points when present.</p>
		<RadioGroup label="Recent trauma or surgery?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="mobility-recentTraumaOrSurgery"
						value={opt.value}
						bind:group={m.recentTraumaOrSurgery}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Mobility factor points">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(subtotal())}"
		>
			{subtotal()} {subtotal() === 1 ? 'point' : 'points'}
		</span>
	</Field>
</Fieldset>
