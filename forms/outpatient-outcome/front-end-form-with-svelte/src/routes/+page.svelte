<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';

	function startAssessment() {
		assessment.reset();
		goto('/assessment');
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<div class="w-full max-w-lg text-center">
		<div class="mb-8">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nhs-blue/10">
				<svg class="h-8 w-8 text-nhs-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-gray-900">Outpatient Outcome Report</h1>
			<p class="mt-3 text-gray-600">
				Record encounter details, patient-reported outcomes, patient experience, and clinical
				outcome for this outpatient episode. The OOCG engine will derive domain grades and
				flag any issues.
			</p>
		</div>

		<div class="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm">
			<h2 class="mb-3 font-semibold text-gray-900">What to expect</h2>
			<ul class="space-y-2 text-sm text-gray-600">
				<li class="flex items-start gap-2">
					<span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
					11 sections covering patient details, encounter, PROMs, PREMs, and sign-off
				</li>
				<li class="flex items-start gap-2">
					<span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
					Takes approximately 10–15 minutes to complete
				</li>
				<li class="flex items-start gap-2">
					<span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
					You can navigate back to change answers at any time
				</li>
				<li class="flex items-start gap-2">
					<span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
					An OOCG composite grade (A–E) and flagged issues are generated at the end
				</li>
			</ul>
		</div>

		<button
			onclick={startAssessment}
			class="mt-6 w-full rounded-lg bg-primary px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-primary-dark"
		>
			Begin Report
		</button>

		<p class="mt-4 text-xs text-gray-400">
			For clinician use. This tool supports but does not replace clinical judgement.
		</p>
	</div>
</div>
