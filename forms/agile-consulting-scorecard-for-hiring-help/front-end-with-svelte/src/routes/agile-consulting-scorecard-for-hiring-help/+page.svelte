<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the scorecard wizard and the reviewer
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'agile-consulting-scorecards-for-hiring-help';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Agile Consulting Scorecard for Hiring Help
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Agile readiness self-assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Sixteen yes/no checkpoints from the Agile Manifesto and the Agile Principles, completed as one
			continuous single-page wizard and graded by the shared engine into a readiness band with
			recommended next actions, to help an organization decide whether it is ready to hire agile
			consulting help.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/agile-consulting-scorecard-for-hiring-help/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new scorecard</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step scorecard. One continuous single-page wizard that scores the
				organization as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/agile-consulting-scorecard-for-hiring-help/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reviewer dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed organizations with their computed score, manifesto and principles subtotals,
				and readiness band, and filter by band and sector.
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
					Capture a structured agile-readiness profile — sixteen yes/no checkpoints, four from the
					Agile Manifesto and twelve from the Agile Principles — and produce a graded report: a
					total score (0-16), a readiness band (Low, Borderline, Medium, High), readiness flags, and
					recommended next actions, to support a hiring decision.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the sum-of-points scoring
					engine, the band table, and the flag rules. The same engine grades both the wizard and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the Agile Manifesto (4 values) and the 12 Agile Principles. This form is not a
					medical device.
				</dd>
			</div>
		</dl>
	</section>
</main>
