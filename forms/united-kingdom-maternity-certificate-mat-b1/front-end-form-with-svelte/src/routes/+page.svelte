<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateMatB1 } from '$lib/engine/mat-b1-validator';
	import Badge from '$lib/components/ui/Badge.svelte';

	import Step1PatientIdentification from '$lib/components/steps/Step1PatientIdentification.svelte';
	import Step2PreConfinement from '$lib/components/steps/Step2PreConfinement.svelte';
	import Step3PostConfinement from '$lib/components/steps/Step3PostConfinement.svelte';
	import Step4IssuerValidation from '$lib/components/steps/Step4IssuerValidation.svelte';

	function submitForm() {
		assessment.result = validateMatB1(assessment.data);
		// Scroll to the result panel.
		if (typeof document !== 'undefined') {
			requestAnimationFrame(() => {
				document.getElementById('mat-b1-result')?.scrollIntoView({ behavior: 'smooth' });
			});
		}
	}

	function startOver() {
		assessment.reset();
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="border-b border-gray-200 bg-white shadow-sm no-print">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-gray-900">
				UK Maternity Certificate (MAT B1)
			</h1>
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
			This single-page form captures the data needed to issue an official UK DWP
			MAT B1 maternity certificate. Choose either Part A (pre-confinement) or
			Part B (post-confinement) — they are mutually exclusive — and provide the
			issuer details for the doctor or registered midwife signing the certificate.
		</div>

		<div class="space-y-8">
			<Step1PatientIdentification />
			<Step2PreConfinement />
			<Step3PostConfinement />
			<Step4IssuerValidation />
		</div>

		<div class="mt-10 flex justify-end">
			<button
				type="button"
				onclick={submitForm}
				class="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
			>
				Validate Certificate
			</button>
		</div>

		{#if assessment.result}
			{@const result = assessment.result}
			<section
				id="mat-b1-result"
				class="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
			>
				<h2 class="mb-4 text-xl font-bold text-gray-900">Validation Result</h2>

				<div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
					<div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
						<div class="text-gray-500">Status</div>
						<div class="mt-1 font-medium">
							{#if result.complete}
								<span class="text-green-700">Complete</span>
							{:else}
								<span class="text-red-700">Incomplete</span>
							{/if}
						</div>
					</div>
					<div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
						<div class="text-gray-500">Branch</div>
						<div class="mt-1 font-medium">
							{result.certificateType === 'pre'
								? 'Part A — pre-confinement'
								: result.certificateType === 'post'
									? 'Part B — post-confinement'
									: 'Not selected'}
							{#if result.issuerType}
								<span class="text-gray-500"> · </span>
								{result.issuerType === 'doctor' ? 'Doctor' : 'Midwife'}
							{/if}
						</div>
					</div>
				</div>

				{#if result.weeksBeforeEwc !== null}
					<p class="mb-4 text-sm text-gray-700">
						Examination is <strong>{result.weeksBeforeEwc}</strong> weeks before the
						expected date of confinement.
					</p>
				{/if}

				{#if result.firedRules.length > 0}
					<h3 class="mb-2 text-sm font-semibold text-gray-900">
						Issues to resolve ({result.firedRules.length})
					</h3>
					<ul class="mb-4 space-y-2">
						{#each result.firedRules as r (r.id)}
							<li class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
								<div class="mb-1 flex items-center gap-2">
									<Badge priority={r.priority} />
									<span class="text-xs text-gray-500">{r.id} · {r.category}</span>
								</div>
								<div class="text-gray-800">{r.message}</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
						No completeness or consistency issues detected.
					</p>
				{/if}

				{#if result.additionalFlags.length > 0}
					<h3 class="mb-2 text-sm font-semibold text-gray-900">
						Additional flags ({result.additionalFlags.length})
					</h3>
					<ul class="space-y-2">
						{#each result.additionalFlags as f (f.id)}
							<li class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
								<div class="mb-1 flex items-center gap-2">
									<Badge priority={f.priority} />
									<span class="text-xs text-gray-500">{f.id} · {f.category}</span>
								</div>
								<div class="text-gray-800">{f.message}</div>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/if}
	</main>
</div>
