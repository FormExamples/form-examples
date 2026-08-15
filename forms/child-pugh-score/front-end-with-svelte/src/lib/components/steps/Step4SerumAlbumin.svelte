<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { albuminPoints } from '#lib/engine/child-pugh-rules.js';
	import { formatPoint } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const a = assessment.data.albumin;
	const point = $derived(albuminPoints(assessment.data));
</script>

<Fieldset legend="Step 4 of 8 — Serum albumin">
	<p class="hint">
		Parameter 2 — measured serum albumin in g/L. Bands: &gt; 35 → 1 point, 28-35 → 2 points, &lt; 28
		→ 3 points (lower albumin scores more).
	</p>

	<Field
		label="Measured serum albumin (g/L)"
		description="Adult serum-albumin results are typically around 35-50 g/L."
		inputId="albumin-serumAlbumin"
	>
		<NumberInput
			id="albumin-serumAlbumin"
			label="Measured serum albumin"
			min={0}
			max={100}
			step={1}
			bind:value={a.serumAlbumin}
		/>
	</Field>

	<Field label="Parameter points">
		<strong class="text-lg text-base-content">{formatPoint(point)}</strong>
	</Field>
</Fieldset>
