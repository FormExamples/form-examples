<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the review wizard and the clinician
	// dashboard.
	const plural = 'structured-medication-reviews';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Structured Medication Review
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			A patient-centred whole-medicines review
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A patient-centred, single continuous wizard that reviews problematic polypharmacy, frailty, or
			high-risk medicines &mdash; recording the patient's problems and priorities, a per-medicine list
			with indication, adherence, and anticholinergic burden, and an agreed monitoring plan &mdash;
			from which the shared engine derives a review status (Complete or Incomplete), a polypharmacy
			and anticholinergic-burden indicator, and a set of flags.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/structured-medication-review/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new review</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step wizard. One continuous single-page form with a repeating editor for
				the medicine list.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/structured-medication-review/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reviewed patients with their computed review status, medicine count,
				anticholinergic-burden score and band, and flag count, and filter by care setting and
				status.
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
					Document the review and produce a graded report &mdash; review status, burden band,
					anticholinergic-burden sum, polypharmacy count, and flagged issues &mdash; to support safe
					medicines optimisation. This is a documentation instrument with partial scoring, not a
					numeric diagnostic score.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the review engine, and the
					flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Grounded in NHS England Structured Medication Review guidance, STOPP/START v3, the
					Anticholinergic Cognitive Burden scale, and NICE NG5 / NG197. A prompt to action, not a
					diagnosis or a substitute for clinical judgement.
				</dd>
			</div>
		</dl>
	</section>
</main>
