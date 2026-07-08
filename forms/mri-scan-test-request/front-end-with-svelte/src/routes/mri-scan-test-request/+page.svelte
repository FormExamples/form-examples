<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/mri-scan-test-requests` and
	// `/mri-scan-test-requests/new`) hold the actual functionality.
	const plural = 'mri-scan-test-requests';
</script>

<main class="mx-auto max-w-3xl px-4 py-10">
	<div class="rounded-2xl border border-base-300 bg-base-100 p-8 shadow-sm">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">MRI Scan Test Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">MRI scan request (referral)</h1>
		<p class="mt-4 text-base text-base-content/70">
			A clinician completes a single-page wizard to request an MRI scan. The shared engine computes
			a four-axis vetting grade — ACR appropriateness, MRI safety (ferromagnetic / electronic implant
			screen with a gadolinium-vs-eGFR contrast check), request completeness, and triage priority —
			plus safety flags and an overall recommendation the imaging vetting desk can triage from.
		</p>

		<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
			<a
				href={`/${plural}/new`}
				class="rounded-xl border border-base-300 p-5 hover:bg-base-200"
			>
				<h2 class="text-lg font-semibold text-base-content">New request</h2>
				<p class="mt-1 text-sm text-base-content/70">
					Complete the eight-section wizard and compute the four-axis vetting grade.
				</p>
			</a>
			<a
				href={`/${plural}`}
				class="rounded-xl border border-base-300 p-5 hover:bg-base-200"
			>
				<h2 class="text-lg font-semibold text-base-content">Vetting dashboard</h2>
				<p class="mt-1 text-sm text-base-content/70">
					Browse sample MRI requests with their computed safety band, triage tier, and recommendation.
				</p>
			</a>
		</div>

		<p class="mt-8 text-sm text-base-content/60">
			Single continuous single-page wizard. Rule and flag IDs match the back-end JSON API.
		</p>
	</div>
</main>
