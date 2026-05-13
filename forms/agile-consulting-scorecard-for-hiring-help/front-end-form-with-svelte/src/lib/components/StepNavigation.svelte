<script lang="ts">
	import { assessment, TOTAL_STEPS } from '$lib/stores/assessment.svelte';
</script>

<div class="flex justify-between gap-2 mt-6 pt-4 border-t border-slate-200">
	<button
		type="button"
		class="px-4 py-1.5 rounded border border-slate-300 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
		disabled={assessment.currentStep === 1}
		onclick={() => assessment.prev()}
	>
		← Back
	</button>
	<button
		type="button"
		class="px-4 py-1.5 rounded bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
		disabled={assessment.currentStep === TOTAL_STEPS}
		onclick={() => assessment.next()}
	>
		Next →
	</button>
</div>
