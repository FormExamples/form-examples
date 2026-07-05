<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the response form and the responses
	// dashboard. The collection routes (`/neurodiversity-adjustment-responses`
	// and `/neurodiversity-adjustment-responses/new`) hold the actual
	// functionality.
	const plural = 'neurodiversity-adjustment-responses';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Neurodiversity Adjustment Response
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Workplace reasonable-adjustments response
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK-aligned workplace reasonable-adjustments response for neurodiversity that an employer
			(line manager, HR adviser, or occupational-health lead) completes in answer to a request. It
			records the overall decision and its rationale, which adjustments were agreed and any
			alternatives offered, the trial period and review date, support / resources /
			responsibilities, and any escalation — then computes a four-axis grade (outcome
			classification, legal / discrimination risk, response completeness, and follow-up / review
			urgency) plus compliance-and-risk flags including an automatic discrimination-risk alert.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new response</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step response form. One continuous single-page wizard that grades the
				response as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Responses dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse completed responses with their computed four-axis grades, and filter by outcome
				classification and follow-up urgency.
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
					Record what the employer decided, what has been agreed, and how it will be reviewed, and
					produce a structured confirmation-and-review record. This is the response half of the
					request/response pair.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis grading engine,
					and the compliance-and-risk flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with ACAS reasonable-adjustments guidance and the Equality Act 2010 duty to make
					reasonable adjustments, and pairs with the sibling neurodiversity-adjustment-request form.
				</dd>
			</div>
		</dl>
	</section>
</main>
