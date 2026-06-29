<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/biopsy-test-requests` and
	// `/biopsy-test-requests/new`) hold the actual functionality.
	const plural = 'biopsy-test-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Biopsy Test Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Tissue-biopsy / pathology request</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A clinician-driven diagnostic tissue-biopsy referral completed as a single continuous wizard:
			requesting clinician, patient identification, requested procedure (site, method, laterality),
			clinical indication and question, lesion description, bleeding and coagulation status, and
			requested urgency. The shared engine grades each request on four orthogonal axes —
			appropriateness, periprocedural bleeding risk, request completeness, and urgency /
			cancer-pathway triage — and raises safety flags for the pathology / interventional vetting
			desk.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new request</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step referral form. One continuous single-page wizard that grades the
				request as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Vetting dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse incoming requests with their computed appropriateness, bleeding-risk band, and triage
				tier, and filter by bleeding risk and triage tier.
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
					Capture a structured biopsy request and produce a graded vetting report — appropriateness,
					bleeding risk, completeness, triage tier, and flagged safety issues — to support the
					pathology / interventional department's triage and booking decision.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis grading engine,
					and the safety-flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with the ACR Appropriateness Criteria, RCR / RCPath biopsy guidance, BSG / ESGE &
					BSIR periprocedural antithrombotic stratification, and NICE NG12 suspected-cancer
					recognition and referral.
				</dd>
			</div>
		</dl>
	</section>
</main>
