<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'ottawa-knee-rules';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Ottawa Knee Rule</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Ottawa Knee Rule imaging decision</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A validated clinical decision rule &mdash; not a score &mdash; that records five objective
			bedside criteria after an acute knee injury through a single continuous wizard and applies
			ANY-of logic to decide whether a knee radiograph is indicated, with no summing or weighting of
			criteria.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/ottawa-knee-rule/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step Ottawa Knee Rule. One continuous single-page wizard that evaluates the
				imaging decision as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form &rarr;</span>
		</a>
		<a
			href="/ottawa-knee-rule/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed imaging decision and fired-criterion count, and
				filter by care setting and decision.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard &rarr;</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture the five Ottawa criteria and produce a graded report — the binary imaging decision
					(X-ray indicated yes/no), which criteria fired, and flagged issues — to reduce unnecessary
					radiography while safely identifying patients who need imaging.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the ANY-of decision engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Stiell et al. (Ann Emerg Med 1995; JAMA 1996; 1997). The output recommends
					whether to image; it does not diagnose or exclude a fracture on its own.
				</dd>
			</div>
		</dl>
	</section>
</main>
