<script lang="ts">
	import { assessment, TOTAL_STEPS } from '$lib/stores/assessment.svelte';

	const pct = $derived(Math.round((assessment.currentStep / TOTAL_STEPS) * 100));
</script>

<div class="my-3" aria-label="Wizard progress">
	<div class="text-xs text-slate-600">Step {assessment.currentStep} of {TOTAL_STEPS}</div>
	<div class="h-2 bg-slate-200 rounded mt-1">
		<div
			class="h-full bg-blue-500 rounded"
			style:width="{pct}%"
			role="progressbar"
			aria-valuenow={pct}
			aria-valuemin="0"
			aria-valuemax="100"
		></div>
	</div>
</div>
