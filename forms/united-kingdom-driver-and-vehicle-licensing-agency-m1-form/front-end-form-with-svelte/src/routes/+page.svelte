<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateM1 } from '$lib/engine/m1-validator';

	import Step1PersonalDetails from '$lib/components/steps/Step1PersonalDetails.svelte';
	import Step2HealthcareProfessionals from '$lib/components/steps/Step2HealthcareProfessionals.svelte';
	import Step3DiagnosisConfirmation from '$lib/components/steps/Step3DiagnosisConfirmation.svelte';
	import Step4MentalHealthConditions from '$lib/components/steps/Step4MentalHealthConditions.svelte';
	import Step5RecentContact from '$lib/components/steps/Step5RecentContact.svelte';
	import Step6Authorisation from '$lib/components/steps/Step6Authorisation.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	function submitForm() {
		assessment.result = validateM1(assessment.data);
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function startOver() {
		assessment.reset();
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="no-print border-b border-gray-200 bg-white shadow-sm">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
			<div>
				<h1 class="text-lg font-bold text-gray-900">
					DVLA M1 — Confidential Medical Information
				</h1>
				<p class="text-xs text-gray-500">Mental health — UK Driver and Vehicle Licensing Agency</p>
			</div>
			<button
				type="button"
				onclick={startOver}
				class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
			>
				Start over
			</button>
		</div>
	</header>

	<main class="mx-auto max-w-3xl px-4 py-6">
		<div class="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
			This single-page form captures the information needed by the Drivers
			Medical Group at DVLA Swansea to assess your fitness to drive in
			relation to a mental health condition. Your responses are confidential
			and used only by the DVLA medical assessor and your healthcare
			professional.
		</div>

		<div class="space-y-8">
			<Step1PersonalDetails />
			<Step2HealthcareProfessionals />
			<Step3DiagnosisConfirmation />
			<Step4MentalHealthConditions />
			<Step5RecentContact />
			<Step6Authorisation />
		</div>

		<div class="mt-10 flex justify-end">
			<button
				type="button"
				onclick={submitForm}
				class="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
			>
				Submit Form
			</button>
		</div>

		{#if assessment.result}
			{@const r = assessment.result}
			<section class="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-2 text-xl font-bold text-gray-900">Submission Summary</h2>
				<p class="mb-4 text-sm text-gray-600">
					Generated at {new Date(r.timestamp).toLocaleString()}
				</p>

				<div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div class="rounded-lg border border-gray-200 bg-gray-50 p-3">
						<p class="text-xs text-gray-500">Branch</p>
						<p class="text-sm font-semibold text-gray-900">
							{r.stoppedAtQ1 ? 'Q1 = No (stopped)' : 'Q1 = Yes (full form)'}
						</p>
					</div>
					<div class="rounded-lg border border-gray-200 bg-gray-50 p-3">
						<p class="text-xs text-gray-500">Conditions reported</p>
						<p class="text-sm font-semibold text-gray-900">{r.conditionCount}</p>
					</div>
					<div class="rounded-lg border border-gray-200 bg-gray-50 p-3">
						<p class="text-xs text-gray-500">Completeness</p>
						<p class="text-sm font-semibold text-gray-900">
							{r.complete ? 'Complete' : 'Incomplete'}
						</p>
					</div>
				</div>

				{#if r.additionalFlags.length > 0}
					<h3 class="mb-2 text-sm font-semibold text-gray-900">Clinical flags</h3>
					<ul class="mb-4 space-y-2">
						{#each r.additionalFlags as flag (flag.id)}
							<li class="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
								<Badge priority={flag.priority} />
								<div>
									<p class="text-xs font-medium text-gray-500">{flag.category}</p>
									<p class="text-sm text-gray-800">{flag.message}</p>
								</div>
							</li>
						{/each}
					</ul>
				{/if}

				{#if r.firedRules.length > 0}
					<h3 class="mb-2 text-sm font-semibold text-gray-900">Validation issues</h3>
					<ul class="space-y-2">
						{#each r.firedRules as rule (rule.id)}
							<li class="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
								<Badge priority={rule.priority} />
								<div>
									<p class="text-xs font-medium text-gray-500">
										{rule.category} · {rule.id}
									</p>
									<p class="text-sm text-gray-800">{rule.message}</p>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-sm text-gray-700">No validation issues detected.</p>
				{/if}
			</section>
		{/if}
	</main>
</div>
