<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the tracker form and the review
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'objectives-and-key-results-trackers';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/objectives-and-key-results-tracker/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new objective</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step tracker. One continuous single-page wizard that grades the objective as
				you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/objectives-and-key-results-tracker/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Review dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse tracked objectives with their computed RAG band, progress, and confidence, and filter by
				level and RAG.
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
					Capture a structured OKR record and produce a graded report — a composite RAG band, the
					instrument breakdown, and flagged issues — to support objective reviews.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the seven-instrument RAG engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Method</dt>
				<dd class="mt-1 text-base-content/70">
					Each instrument grades to Red / Amber / Green; the composite is the worst band across all
					instruments.
				</dd>
			</div>
		</dl>
	</section>
</main>
