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
		<h1 class="text-3xl font-bold text-gray-900">Oncology Assessment</h1>
		<p class="mt-3 text-gray-600">ECOG-based oncology assessment with diagnosis, treatment, symptoms, and supportive care.</p>

		<Panel label="What to expect" class="mt-6 text-left">
			<h2 class="mb-3 font-semibold text-gray-900">What to expect</h2>
			<ul class="space-y-2 text-sm text-gray-600">
				<li>10 sections covering oncology assessment</li>
				<li>Takes approximately 15-20 minutes</li>
				<li>PDF report generated at the end</li>
			</ul>
		</Panel>

		<div class="button-group justify-center">
			<Button data-variant="primary" onclick={startAssessment}>Begin Assessment</Button>
		</div>

		<p class="mt-4 text-xs text-gray-400">This tool is for clinical support only.</p>
	</div>
</div>
