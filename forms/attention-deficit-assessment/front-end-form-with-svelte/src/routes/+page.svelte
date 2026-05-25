<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';

	function startAssessment() {
		assessment.reset();
		goto('/assessment');
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<div class="w-full max-w-lg text-center">
		<div class="mb-8">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
				<svg class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-gray-900">ADHD Assessment</h1>
			<p class="mt-3 text-gray-600">
				Complete this questionnaire based on the ASRS v1.1 (Adult ADHD Self-Report Scale)
				to help screen for attention-deficit/hyperactivity disorder.
			</p>
		</div>

		<Panel label="What to expect" class="text-left">
			<h2 class="mb-3 font-semibold text-gray-900">What to expect</h2>
			<ul class="space-y-2 text-sm text-gray-600">
				<li>10 sections covering demographics, ADHD symptoms, history, and medical background</li>
				<li>Takes approximately 15–20 minutes to complete</li>
				<li>You can navigate back to change answers at any time</li>
				<li>A report will be generated at the end with a downloadable PDF</li>
			</ul>
		</Panel>

		<div class="button-group justify-center">
			<Button data-variant="primary" onclick={startAssessment}>Begin Assessment</Button>
		</div>

		<p class="mt-4 text-xs text-gray-400">
			This tool is for clinical screening only. All assessments must be reviewed by a qualified clinician.
		</p>
	</div>
</div>
