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
			<h1 class="text-3xl font-bold text-gray-900">Semaglutide Assessment</h1>
			<p class="mt-3 text-gray-600">
				Complete this questionnaire to generate a GLP-1 receptor agonist eligibility screening.
				Your responses will be used to assess eligibility for semaglutide therapy.
			</p>
		</div>

		<Panel label="What to expect" class="text-left">
			<h2 class="mb-3 font-semibold text-gray-900">What to expect</h2>
			<ul class="space-y-2 text-sm text-gray-600">
				<li>10 sections covering demographics, medical history, and treatment planning</li>
				<li>Takes approximately 10-15 minutes to complete</li>
				<li>You can navigate back to change answers at any time</li>
				<li>An eligibility report will be generated with a downloadable PDF</li>
			</ul>
		</Panel>

		<div class="button-group justify-center">
			<Button data-variant="primary" onclick={startAssessment}>Begin Assessment</Button>
		</div>

		<p class="mt-4 text-xs text-gray-400">
			This tool is for clinical support only. Semaglutide prescribing decisions must be made by an appropriately trained healthcare professional.
		</p>
	</div>
</div>
