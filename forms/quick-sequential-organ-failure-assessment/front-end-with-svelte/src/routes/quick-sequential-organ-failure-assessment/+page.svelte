<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'quick-sequential-organ-failure-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Quick Sequential Organ Failure Assessment
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">qSOFA bedside sepsis-risk screen</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A bedside screen for adults with suspected or confirmed infection, completed as a single
			continuous wizard, that scores three objective criteria and flags qSOFA &ge; 2 as a positive
			screen that prompts escalation to a full SOFA and sepsis workup.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/quick-sequential-organ-failure-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step qSOFA screen. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/quick-sequential-organ-failure-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed qSOFA score and risk band, and filter by care
				setting and escalation.
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
					Capture the three qSOFA criteria — respiratory rate &ge; 22/min, altered mentation (GCS
					&lt; 15), and systolic blood pressure &le; 100 mmHg, each scoring 1 point — and produce a
					graded report — score 0-3, risk band, and flagged issues — to support timely sepsis
					escalation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the additive scoring engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the Sepsis-3 consensus definitions (Singer et al., JAMA 2016; Seymour et al.,
					JAMA 2016) and NICE NG51. A screening prompt, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
