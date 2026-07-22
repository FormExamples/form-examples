<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/colonoscopy-test-requests` and
	// `/colonoscopy-test-requests/new`) hold the actual functionality.
	const plural = 'colonoscopy-test-requests';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/colonoscopy-test-request/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new request</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step request form. One continuous single-page wizard that grades the request
				as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/colonoscopy-test-request/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Vetting dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse incoming requests with their computed four-axis grades, and filter by triage tier and
				recommendation.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture why a patient needs a lower-GI endoscopy and how urgently — including lower-GI
					red-flag symptoms, FIT and haemoglobin results, anticoagulant / antiplatelet medication,
					and bowel-preparation fitness and renal function — and produce a vetting report the
					endoscopy unit can triage and book from.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis grading engine,
					and the safety-critical flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with NICE NG12 suspected-cancer referral, NICE DG56 FIT triage, BSG / ESGE
					bowel-preparation and periprocedural anticoagulation guidance, ASA physical-status grading,
					and the ASGE / EPAGE Appropriate Use Criteria.
				</dd>
			</div>
		</dl>
	</section>
</main>
