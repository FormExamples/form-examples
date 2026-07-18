<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the operation-note form and the
	// clinician dashboard. The collection routes (`/medical-operation-notes`
	// and `/medical-operation-notes/new`) hold the actual functionality.
	const plural = 'medical-operation-notes';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Medical Operation Note</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Operating-team surgical record</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A contemporaneous operating-team surgical record, completed as a single continuous wizard,
			that computes a composite operative-risk grade (Routine / Complicated / High-risk / Critical)
			via a max-grade algorithm with Clavien–Dindo and ASA context, and raises WHO Sign-Out safety
			flags for the surgical team.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/medical-operation-note/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new operation note</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step op-note form. One continuous single-page wizard that grades the case as
				you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/medical-operation-note/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded operations with their computed composite risk, Clavien–Dindo grade, blood
				loss, counts, and safety flags, and filter by risk and urgency.
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
					Capture a structured, objective intra-operative record and produce a graded report —
					composite operative risk, Clavien–Dindo grade, blood-loss band, agreed counts, and the WHO
					Sign-Out safety flags — to support surgical record-keeping and review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the max-grade composite-risk
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Grounded in RCS Good Surgical Practice §3.5, the WHO Surgical Safety Checklist, NHS England
					Never Events Policy, the Clavien–Dindo classification, NCEPOD urgency, and OPCS-4 procedure
					coding.
				</dd>
			</div>
		</dl>
	</section>
</main>
