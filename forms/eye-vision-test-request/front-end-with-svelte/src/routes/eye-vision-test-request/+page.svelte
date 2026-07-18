<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/eye-vision-test-requests` and
	// `/eye-vision-test-requests/new`) hold the actual functionality.
	const plural = 'eye-vision-test-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Eye Vision Test Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Ophthalmic / optometric eye examination request
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS–aligned eye examination request (referral) that a clinician completes to record why,
			how, and how urgently a patient needs an eye vision test, so the engine can compute a four-axis
			vetting grade and safety-critical flags to support the eye-care service's triage decision.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/eye-vision-test-request/{plural}/new"
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
			href="/eye-vision-test-request/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Vetting dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse incoming requests with their computed four-axis grades, and filter by triage tier and
				clinical priority.
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
					Capture why a patient needs an eye vision test — the requested test, the eye(s) to be
					examined, the clinical indication and specific question, relevant history, symptoms and red
					flags, and how urgently — then produce a four-axis vetting grade (appropriateness, urgency /
					triage priority, request completeness, and clinical priority) plus safety-critical flags that
					the eye-care team can triage and book from.
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
					Aligned with Royal College of Ophthalmologists (RCOphth) acute-eye and referral guidance,
					NICE NG81 glaucoma, NICE QS180 serious eye disorders, and the NHS Diabetic Eye Screening
					Programme.
				</dd>
			</div>
		</dl>
	</section>
</main>
