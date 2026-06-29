<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';

	const vis = assessment.data.visuospatialScores;

	function setScore(value: 0 | 1) {
		vis.copying = value;
	}
</script>

<Fieldset legend="Visuospatial">
	<p class="hint">Ask the patient to copy intersecting pentagons (1 point). All 10 angles must be present and 2 must intersect.</p>

	<div class="mmse-item">
		<p class="mmse-q">Copy intersecting pentagons</p>
		<p class="mmse-ex">Show the patient two intersecting pentagons and ask them to copy the design exactly. Score 1 point if all 10 angles are present and two shapes intersect.</p>
		<fieldset class="radio-group" aria-label="Copy intersecting pentagons">
			<label><input type="radio" class="radio-input" name="vis-copying" checked={vis.copying === 1} onchange={() => setScore(1)} /> Correct (1)</label>
			<label><input type="radio" class="radio-input" name="vis-copying" checked={vis.copying === 0} onchange={() => setScore(0)} /> Incorrect (0)</label>
		</fieldset>
	</div>
</Fieldset>

<style>
	.mmse-item {
		margin-bottom: 0.75rem;
	}
	.mmse-q {
		margin: 0 0 0.125rem;
		font-size: 0.9375rem;
		font-weight: 500;
	}
	.mmse-ex {
		margin: 0 0 0.375rem;
		font-size: 0.75rem;
		color: var(--color-muted);
	}
</style>
