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
			<h1 class="text-3xl font-bold text-gray-900">Hearing Aid Assessment</h1>
			<p class="mt-3 text-gray-600">
				Hearing aid candidacy evaluation using the HHIE-S questionnaire.
			</p>
		</div>

		<Panel label="What to expect" class="text-left">
			<h2 class="mb-3 font-semibold text-gray-900">What to expect</h2>
			<ul class="space-y-2 text-sm text-gray-600">
				<li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>9 sections covering hearing history, exam, and goals</li>
				<li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>10-15 minutes to complete</li>
				<li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>PDF report generated at the end</li>
			</ul>
		</Panel>

		<div class="button-group justify-center">
			<Button data-variant="primary" onclick={startAssessment}>Begin Assessment</Button>
		</div>

		<p class="mt-4 text-xs text-gray-400">This tool is for clinical support only.</p>
	</div>
</div>
