<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'edinburgh-postnatal-depression-scales';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Edinburgh Postnatal Depression Scale
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">EPDS perinatal-depression screen</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A 10-item self-report screen, completed as a single continuous wizard, that rates ten
			statements about the respondent's past seven days to flag possible perinatal (antenatal and
			postnatal) depression &mdash; a screen, not a diagnostic test.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/edinburgh-postnatal-depression-scale/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step EPDS screen. One continuous single-page wizard that scores the
				respondent as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/edinburgh-postnatal-depression-scale/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed respondents with their computed EPDS total and interpretation band, and
				filter by care setting and band.
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
					Capture the ten EPDS items — each scored 0 to 3, with items 3, 5, 6, 7, 8, 9 and 10
					reverse-scored — and produce a graded report: a total of 0-30 with an interpretation band
					(&ge; 10 possible, &ge; 13 likely depression), a mandatory safety flag whenever item 10
					(thoughts of self-harm) scores &gt; 0 independent of the total, and other flagged issues,
					to support timely perinatal mental-health assessment.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the reverse-scoring engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on Cox, Holden &amp; Sagovsky (British Journal of Psychiatry, 1987) and NICE CG192.
					A screening prompt, not a diagnosis; item 10 always prompts a self-harm review.
				</dd>
			</div>
		</dl>
	</section>
</main>
