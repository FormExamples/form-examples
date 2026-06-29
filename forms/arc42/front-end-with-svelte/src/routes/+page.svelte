<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the documentation wizard and the
	// architecture dashboard. The collection routes (`/arc42-documents` and
	// `/arc42-documents/new`) hold the actual functionality.
	const plural = 'arc42-documents';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">arc42</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Architecture documentation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A complete arc42 software-architecture document captured as a single continuous wizard: the
			twelve arc42 sections from Introduction &amp; Goals through Risks &amp; Technical Debt, plus
			summary and sign-off. The shared engine grades per-section completeness (empty / partial /
			complete), derives an overall maturity band, and flags critical omissions for review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new document</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step documentation wizard. One continuous single-page form that grades
				maturity as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the wizard →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Architecture dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse documented architectures with their computed maturity band, completed-section count,
				and open flags, and filter by maturity and sign-off recommendation.
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
					Capture a structured arc42 architecture record and produce a graded report — maturity
					band, per-section completeness, fired rules, and flagged omissions — to support
					architecture review and sign-off.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness rules, the
					maturity-band algorithm, and the flag rules. The same engine grades both the wizard and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Follows the arc42 template for software-architecture documentation and ISO/IEC/IEEE
					26514:2022 for information quality. This form is non-clinical.
				</dd>
			</div>
		</dl>
	</section>
</main>
