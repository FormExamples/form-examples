<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'glasgow-coma-scales';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Glasgow Coma Scale</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">GCS neuro-observation assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured, clinician-driven assessment of impaired consciousness, completed as a single
			continuous wizard. The observer scores three independent responses — Eye opening (E, 1&ndash;4),
			Verbal response (V, 1&ndash;5), and Motor response (M, 1&ndash;6) — and the shared engine computes the
			total GCS (3&ndash;15), the E/V/M breakdown, and a severity band (mild / moderate / severe). It
			supports a "not testable" (NT) result per component and derives the secondary GCS-Pupils
			(GCS-P) score. A defined total GCS &le; 8 signals coma and airway risk.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step GCS wizard. One continuous single-page form that scores the patient as
				you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed total GCS, severity band, and GCS-Pupils, and
				filter by care setting and severity.
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
					Capture the three GCS components and produce a graded report — total GCS, breakdown,
					severity band, GCS-Pupils, and flagged issues — to support timely neurological escalation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the deterministic scoring
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Follows the 2014 Glasgow structured approach (Teasdale et al.) and the GCS-Pupils score. A
					structured observation record, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
