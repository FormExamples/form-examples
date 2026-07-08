<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/endoscopy-test-requests` and
	// `/endoscopy-test-requests/new`) hold the actual functionality.
	const plural = 'endoscopy-test-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Endoscopy Test Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			GI endoscopy procedure request (referral)
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS–aligned GI endoscopy request that a clinician completes to request a gastrointestinal
			endoscopy for a patient. It records the requested procedure, the clinical indication and
			specific question, ALARM red-flag symptoms, FIT and haematinic results, anticoagulant /
			antiplatelet medication, comorbidities, infection-control flags, the bowel-preparation and
			sedation plan, and the requested urgency — then computes a four-axis vetting grade
			(appropriateness, cancer-pathway urgency, request completeness, and pre-procedure risk) plus
			safety-critical flags to support the endoscopy unit's triage and booking decision.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/endoscopy-test-request/{plural}/new"
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
			href="/endoscopy-test-request/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Vetting dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse incoming requests with their computed four-axis grades, and filter by triage tier
				and pre-procedure risk.
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
					Capture why a patient needs a GI endoscopy and how urgently, and produce a vetting report
					the endoscopy unit can triage and book from.
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
					anticoagulation guidance, the Glasgow-Blatchford and Rockall bleeding scores, ASA
					physical-status grading, and the ACR / ASGE Appropriate Use Criteria.
				</dd>
			</div>
		</dl>
	</section>
</main>
