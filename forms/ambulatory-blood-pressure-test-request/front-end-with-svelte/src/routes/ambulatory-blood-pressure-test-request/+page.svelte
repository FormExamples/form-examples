<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'ambulatory-blood-pressure-test-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Ambulatory Blood Pressure Test Request
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">ABPM monitoring request &amp; vetting</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS–aligned ambulatory blood pressure monitoring (ABPM) request, completed as a single
			continuous wizard, that the shared engine grades on four independent axes and flags as
			safety-critical when needed.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/ambulatory-blood-pressure-test-request/{plural}/new"
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
			href="/ambulatory-blood-pressure-test-request/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Vetting dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse incoming requests with their computed appropriateness, suitability, completeness, and
				triage tier, and filter by triage and recommendation.
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
					Capture a structured ABPM referral — requesting clinician, patient identification,
					requested test, clinic blood pressure, symptoms and accuracy factors, and triage — and
					produce a four-axis vetting report: appropriateness (NICE NG136), measurement suitability
					(BIHS), completeness, triage priority, a recommendation, and safety flags such as severe
					or accelerated hypertension, to support the monitoring service's triage and booking
					decision.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis grading engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with NICE NG136 <em>Hypertension in adults</em> and British and Irish Hypertension
					Society (BIHS) ABPM measurement guidance.
				</dd>
			</div>
		</dl>
	</section>
</main>
