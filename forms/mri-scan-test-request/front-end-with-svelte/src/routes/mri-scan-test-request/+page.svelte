<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/mri-scan-test-requests` and
	// `/mri-scan-test-requests/new`) hold the actual functionality.
	const plural = 'mri-scan-test-requests';
</script>

<main class="mx-16 px-4 py-10">
	<div class="rounded-2xl border border-base-300 bg-base-100 p-8 shadow-sm">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">MRI Scan Test Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">MRI scan request (referral)</h1>
		<p class="mt-4 text-base text-base-content/70">
			A clinician completes a single-page wizard to request an MRI scan, and the shared engine
			computes a four-axis vetting grade — ACR appropriateness, MRI safety (ferromagnetic /
			electronic implant screen with a gadolinium-vs-eGFR contrast check), request completeness,
			and triage priority — plus safety flags and an overall recommendation the imaging vetting
			desk can triage from.
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

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture the requested body region and clinical indication, the specific clinical question,
					contrast and gadolinium / renal (NSF) risk, and a structured MRI safety screen for
					ferromagnetic and electronic implants, then produce a graded vetting report — four-axis
					grade, safety-critical flags, and an overall recommendation — to support the imaging
					department's safety review, protocolling, and booking decision.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis grading engine
					(ACR appropriateness, MRI safety, request completeness, and triage priority), and the flag
					rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the ACR Appropriateness Criteria, the ACR Manual on MR Safety, MHRA safety
					guidelines for magnetic resonance imaging equipment in clinical use, and ESUR / RCR
					gadolinium-based contrast agent guidance. A vetting aid for the imaging desk, not a
					diagnostic tool.
				</dd>
			</div>
		</dl>
	</section>
</main>
