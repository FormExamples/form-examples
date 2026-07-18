<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the examiner checklist and the training
	// coordinator dashboard. The collection routes hold the actual functionality.
	const plural = 'lifeguard-certification-checklists';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Lifeguard Certification Checklist</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Pool / beach lifeguard competency verification</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A RLSS UK NPLQ / ILSF-aligned competency verification completed as a single continuous wizard,
			whose shared engine grades the candidate Pass / Needs Development / Fail — any
			critical-competency breach forces a Fail — and flags issues for the examiner.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/lifeguard-certification-checklist/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new checklist</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step examiner checklist. One continuous single-page wizard that grades the
				candidate as you record each competency.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the checklist →</span>
		</a>
		<a
			href="/lifeguard-certification-checklist/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Training coordinator dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed candidates with their computed outcome, critical failures, deficiencies, and
				flags, and filter by outcome and venue.
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
					Record a structured competency assessment — candidate details, physical fitness and swim
					competency, supervision and scanning, conscious and unconscious rescue, spinal injury
					management, CPR and AED, first aid and oxygen therapy, and legal / regulatory knowledge —
					and produce a graded report: Pass / Needs Development / Fail, critical failures,
					deficiencies, and flagged issues, to support certification decisions.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the declarative competency
					rules, and the flag rules. The same engine grades both the checklist and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with the RLSS UK National Pool Lifeguard Qualification (NPLQ) and the International
					Life Saving Federation (ILSF) competencies.
				</dd>
			</div>
		</dl>
	</section>
</main>
