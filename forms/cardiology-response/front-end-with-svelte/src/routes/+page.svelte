<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the response form and the responses
	// dashboard. The collection routes (`/cardiology-responses` and
	// `/cardiology-responses/new`) hold the actual functionality.
	const plural = 'cardiology-responses';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Cardiology Response</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Cardiology response / consult reply
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS–aligned cardiology response that a cardiology clinician completes in answer to a
			referral. It records the consultation type, the clinical summary and examination, the
			investigations performed, the structured findings, the diagnosis, the key left-ventricular
			ejection fraction, and the management plan and follow-up — then computes a four-axis
			interpretation grade (response classification, condition severity, response completeness, and
			follow-up urgency) plus safety-critical flags including an automatic critical-result alert.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new response</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step response form. One continuous single-page wizard that grades the
				response as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Responses dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse completed responses with their computed four-axis grades, and filter by classification
				and follow-up urgency.
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
					Record what the cardiology assessment found and what should happen next, and produce an
					interpretation report. This is the response half of the request/response pair.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis interpretation
					engine, and the safety-critical flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with NHS cardiology consultation reporting and critical-result communication
					practice, and pairs with the sibling cardiology-request referral form.
				</dd>
			</div>
		</dl>
	</section>
</main>
