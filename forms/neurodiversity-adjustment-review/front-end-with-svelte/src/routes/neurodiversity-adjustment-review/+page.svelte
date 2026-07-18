<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the review form and the reviews
	// dashboard. The collection routes (`/neurodiversity-adjustment-reviews`
	// and `/neurodiversity-adjustment-reviews/new`) hold the actual
	// functionality.
	const plural = 'neurodiversity-adjustment-reviews';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Neurodiversity Adjustment Review
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Workplace reasonable-adjustments review
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK-aligned workplace reasonable-adjustments review for neurodiversity that a manager or HR
			contact completes with the worker to check whether the agreed adjustments are still working,
			computing a four-axis grade (overall effectiveness, wellbeing risk, review completeness, and
			next-step urgency) plus review flags including an automatic adjustments-not-working alert.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/neurodiversity-adjustment-review/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new review</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step review form. One continuous single-page wizard that grades the review
				as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/neurodiversity-adjustment-review/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reviews dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse completed reviews with their computed four-axis grades, and filter by effectiveness
				and next-step urgency.
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
					Record how the agreed adjustments are working in practice — the per-category effectiveness
					of the adjustments in place, the worker's feedback and outcomes, any changes arising, and
					the next review date — and produce a structured review record. This is the review third
					of the ACAS request / confirmation / review cycle.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis grading engine,
					and the review-flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with ACAS reasonable-adjustments guidance and the Equality Act 2010 principle that
					adjustments are reviewed regularly, and pairs with the sibling
					neurodiversity-adjustment-request and neurodiversity-adjustment-response forms.
				</dd>
			</div>
		</dl>
	</section>
</main>
