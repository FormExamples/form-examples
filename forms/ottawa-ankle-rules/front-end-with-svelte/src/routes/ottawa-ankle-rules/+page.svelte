<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'ottawa-ankle-ruleses';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Ottawa Ankle Rules (and Ottawa Foot Rules)
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Ottawa Ankle / Foot imaging decision rule</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A validated bedside decision rule &mdash; not a score &mdash; for adults after an acute ankle or
			midfoot injury, completed as a single continuous wizard, that independently indicates an ankle
			X-ray and/or a foot X-ray from malleolar- or midfoot-zone pain, bony tenderness at four
			landmarks, and inability to bear weight.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/ottawa-ankle-rules/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step Ottawa Ankle / Foot Rules. One continuous single-page wizard that
				derives the two imaging decisions as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form &rarr;</span>
		</a>
		<a
			href="/ottawa-ankle-rules/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed ankle and foot imaging decisions, and filter by
				care setting and decision.
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
					Capture the zone-of-pain preconditions, bone tenderness at four landmarks, and ability to
					bear weight, and produce a graded report — two independent imaging decisions, the criteria
					that drove them, and flagged issues — to direct radiography.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the boolean decision engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Derived and validated by Stiell et al. (Ann Emerg Med 1992; JAMA 1993/1994). The rule is
					highly sensitive: a negative result reduces but does not formally exclude fracture. Use
					clinical judgement alongside the computed decision.
				</dd>
			</div>
		</dl>
	</section>
</main>
