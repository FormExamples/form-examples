<script lang="ts">
	// ProgressBar — Lily Svelte native <progress class="progress"> contract.
	import type { StepConfig } from '$lib/engine/types';

	let {
		currentStep,
		steps
	}: {
		currentStep: number;
		steps: StepConfig[];
	} = $props();

	const progress = $derived(
		steps.length > 0
			? ((steps.findIndex((s) => s.number === currentStep) + 1) / steps.length) * 100
			: 0
	);
	const currentIndex = $derived(steps.findIndex((s) => s.number === currentStep) + 1);
</script>

<div class="progress-region">
	<p class="subtitle" aria-live="polite">
		Step {currentIndex} of {steps.length} — {Math.round(progress)}% complete
	</p>
	<progress
		class="progress"
		max="100"
		value={Math.round(progress)}
		aria-label="Form completion"
	></progress>
</div>
