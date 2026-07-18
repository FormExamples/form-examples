<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/ct-scan-test-requests` and
	// `/ct-scan-test-requests/new`) hold the actual functionality.
	const plural = 'ct-scan-test-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">CT Scan Test Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			CT (computed tomography) scan request
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS–aligned CT scan request (referral) that a clinician completes to request a CT
			examination, computing a four-axis vetting grade plus safety-critical flags to support the
			imaging department's triage and protocolling decision.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/ct-scan-test-request/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new request</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step request form. One continuous single-page wizard that grades the
				request as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/ct-scan-test-request/{plural}"
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
					Capture why a patient needs a CT examination and how urgently — the requested body region,
					clinical indication and specific question, relevant history, contrast and renal-safety
					factors, IR(ME)R radiation justification, and requested urgency — and produce a four-axis
					vetting report (appropriateness, radiation &amp; contrast safety, request completeness, and
					triage priority) the imaging department can triage and protocol from.
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
					Aligned with the ACR Appropriateness Criteria, the Royal College of Radiologists (RCR)
					<em>iRefer</em> guidance, ESUR contrast-media safety guidelines, and the UK Ionising
					Radiation (Medical Exposure) Regulations — IR(ME)R 2017.
				</dd>
			</div>
		</dl>
	</section>
</main>
