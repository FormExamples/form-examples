<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/sleep-study-test-requests` and
	// `/sleep-study-test-requests/new`) hold the actual functionality.
	const plural = 'sleep-study-test-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Sleep Study Test Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Sleep study / polysomnography request
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS–aligned sleep-study request that a clinician completes to refer a patient for a sleep
			investigation, mainly to diagnose or exclude obstructive sleep apnoea. It records the requested
			study type, the clinical indication and specific question, the Epworth and STOP-BANG scores,
			anthropometry, symptoms and risk factors, and the requested urgency — then computes a four-axis
			grade (appropriateness, clinical priority, request completeness, and triage) plus
			safety-critical flags to support the sleep service's triage and booking decision.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/sleep-study-test-request/{plural}/new"
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
			href="/sleep-study-test-request/{plural}"
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
					Capture why a patient should have a sleep study and how urgently, and produce a vetting
					report the sleep service can triage and book from.
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
					Aligned with NICE NG202 (OSAHS / OHS / COPD–OSAHS overlap), SIGN sleep guidance, the
					Epworth Sleepiness Scale, the STOP-BANG questionnaire, and DVLA fitness-to-drive guidance.
				</dd>
			</div>
		</dl>
	</section>
</main>
