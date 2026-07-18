<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the ward round note form and the
	// clinician dashboard.
	const plural = 'ward-round-notes';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Ward Round Note</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Ward Round Note — a daily inpatient review
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A daily inpatient review, documented at the bedside during a ward round as a single continuous
			wizard across ten review components, that this <strong>documentation and completeness</strong>
			instrument grades <strong>Complete</strong>, <strong>Partial</strong>, or
			<strong>Incomplete</strong> and independently checks for safety flags requiring escalation.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/ward-round-note/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new note</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step ward round note. One continuous single-page wizard that grades
				completeness as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/ward-round-note/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse documented daily reviews with their computed completeness status and safety flags,
				and filter by completeness and ward.
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
					Record a single daily ward round review across the ten review components — review header,
					overnight events, current problems and progress, examination and NEWS2, investigations
					reviewed, VTE assessment status, medication changes, plan and jobs, escalation /
					ceiling-of-care status, and estimated discharge — and produce a graded report: a
					complete / partial / incomplete classification, a completeness percentage over the eight
					required components, per-component presence, and independently raised safety flags (a
					deteriorating NEWS2 needing escalation, a VTE assessment not done, no plan documented, or
					abnormal results not actioned — an explicit negative such as "no changes" counts as
					documented) — to support continuity of care between shifts and prompt escalation and
					safety-netting. A Complete grade means the entry is well documented for handover, not
					that the clinical care itself was correct.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Grounded in GMC Good Medical Practice record-keeping, the AoMRC record standards, NEWS2,
					and NICE NG89 VTE guidance. A documentation and completeness aid, not a diagnosis, a risk
					score, or a substitute for clinical judgement.
				</dd>
			</div>
		</dl>
	</section>
</main>
