<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the plan form and the clinician
	// dashboard.
	const plural = 'plans';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Recommended Summary Plan for Emergency Care and Treatment
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">ReSPECT emergency care and treatment plan</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK personalised emergency care and treatment plan created through shared decision-making,
			completed as a single continuous wizard — a documentation and completeness instrument, not a
			score.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/recommended-summary-plan-for-emergency-care-and-treatment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new plan</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step ReSPECT plan. One continuous single-page wizard that shows the live
				completeness status as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/recommended-summary-plan-for-emergency-care-and-treatment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse plans with their computed completeness status and CPR recommendation, and filter by
				status and recommendation.
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
					Record and validate clinician-agreed recommendations for emergency care — a summary of
					relevant health, what matters to the person, agreed clinical recommendations balancing
					life-sustaining treatment against comfort, an explicit CPR recommendation (attempt or
					do-not-attempt), and agreed ceilings of treatment — producing a completeness status,
					mandatory-rule results, and safety flags, not a clinical score.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the eight mandatory
					completeness rules, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					ReSPECT (version 3.0) is developed and maintained by the Resuscitation Council UK. The
					capacity and involvement rules reflect the Mental Capacity Act 2005 (in Scotland, the
					Adults with Incapacity (Scotland) Act 2000). A ReSPECT plan records recommendations, not
					legally binding instructions.
				</dd>
			</div>
		</dl>
	</section>
</main>
