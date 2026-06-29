<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/pet-scan-test-requests` and
	// `/pet-scan-test-requests/new`) hold the actual functionality.
	const plural = 'pet-scan-test-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">PET Scan Test Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			PET-CT scan request (referral)
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS–aligned PET-CT (positron emission tomography) scan request that a clinician completes
			to request a PET-CT examination — most commonly an oncology FDG-PET-CT for cancer staging,
			restaging, or treatment-response assessment. It records the requested tracer and scan type, the
			indication and specific clinical question, the FDG patient-preparation and safety data
			(diabetes, blood glucose, pregnancy, breastfeeding, renal function), the IR(ME)R justification,
			and the requested urgency — then computes a four-axis vetting grade (appropriateness,
			preparation safety and radiation dose, request completeness, and triage priority) plus
			safety-critical flags to support the nuclear-medicine department's triage and booking decision.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
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
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Vetting dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse incoming PET-CT requests with their computed four-axis grades, and filter by triage
				tier and recommendation.
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
					Capture why a PET-CT examination is requested and how urgently, assess its preparation
					safety and radiation justification, and produce a vetting report the nuclear-medicine team
					can triage and book from.
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
					Aligned with the ACR Appropriateness Criteria, RCR iRefer, EANM / SNMMI FDG-PET procedure
					guidelines, and the UK Ionising Radiation (Medical Exposure) Regulations — IR(ME)R 2017.
				</dd>
			</div>
		</dl>
	</section>
</main>
