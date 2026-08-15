<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculatePaduaGrade } from '#lib/engine/padua-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const h = assessment.data.history;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const subtotal = $derived(() => {
		const fp = calculatePaduaGrade(assessment.data).factorPoints;
		return (fp.activeCancer ?? 0) + (fp.previousVte ?? 0) + (fp.knownThrombophilia ?? 0);
	});
</script>

<Fieldset legend="Step 3 of 8 — Oncology and thrombosis history">
	<p class="hint">
		High-weight factors — active cancer, previous VTE, and known thrombophilia each score 3 points.
	</p>

	<Field label="Active cancer? (metastatic and/or chemo/radiotherapy in the previous 6 months)">
		<p class="hint">Factor 1 — 3 points when present.</p>
		<RadioGroup label="Active cancer?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="history-activeCancer"
						value={opt.value}
						bind:group={h.activeCancer}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field
		label="Previous VTE? (deep-vein thrombosis or pulmonary embolism; excludes superficial vein thrombosis)"
	>
		<p class="hint">Factor 2 — 3 points when present.</p>
		<RadioGroup label="Previous VTE?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="history-previousVte"
						value={opt.value}
						bind:group={h.previousVte}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field
		label="Known thrombophilia? (e.g. antithrombin, protein C or S defect, factor V Leiden, prothrombin G20210A, antiphospholipid syndrome)"
	>
		<p class="hint">Factor 4 — 3 points when present.</p>
		<RadioGroup label="Known thrombophilia?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="history-knownThrombophilia"
						value={opt.value}
						bind:group={h.knownThrombophilia}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="History factor points">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(subtotal())}"
		>
			{subtotal()} {subtotal() === 1 ? 'point' : 'points'}
		</span>
	</Field>
</Fieldset>
