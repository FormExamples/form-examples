<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the handling
	// dashboard. The collection routes (`/neurodiversity-adjustment-requests` and
	// `/neurodiversity-adjustment-requests/new`) hold the actual functionality.
	const plural = 'neurodiversity-adjustment-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Neurodiversity Adjustment Request
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Workplace reasonable-adjustments request for neurodiversity
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK-aligned reasonable-adjustments request that a worker (or a manager on their behalf)
			completes to ask their employer for adjustments at work. It records the worker's neurodivergent
			profile, the functional difficulties they experience across the ACAS functional areas, the
			specific adjustments requested, any supporting evidence, and the current impact and urgency —
			then computes a four-axis grade (Equality Act 2010 eligibility, impact / wellbeing risk,
			request completeness, and handling priority) plus compliance-and-wellbeing flags to support
			the employer's duty to make reasonable adjustments without unreasonable delay.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/neurodiversity-adjustment-request/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new request</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step request form. One continuous single-page wizard that grades the
				request as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/neurodiversity-adjustment-request/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Handling dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse incoming requests with their computed four-axis grades, and filter by handling
				priority and recommendation.
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
					Capture what a neurodivergent worker needs and why, and produce a structured request the
					employer can act on. This is the request half of the request/response pair.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis grading engine,
					and the compliance-and-wellbeing flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with the ACAS guidance on reasonable adjustments for neurodiversity, the Equality
					Act 2010 duty to make reasonable adjustments, and the government Access to Work scheme.
				</dd>
			</div>
		</dl>
	</section>
</main>
