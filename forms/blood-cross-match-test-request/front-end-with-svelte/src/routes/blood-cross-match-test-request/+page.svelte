<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the transfusion-
	// laboratory vetting dashboard. The collection routes hold the functionality.
	const plural = 'blood-cross-match-test-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Blood Cross-Match Test Request
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Transfusion compatibility request</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS–aligned blood cross-match / transfusion compatibility request completed by a clinician
			as a single continuous wizard: requesting clinician, patient identification, requested test and
			component, clinical indication, blood group and history, sample and identity safety, and triage.
			The shared engine grades the request on four independent axes — appropriateness (NICE NG24),
			identity / sample safety (BSH / SHOT), request completeness, and triage priority — and raises
			safety-critical flags to support the transfusion laboratory's acceptance and prioritisation
			decision.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/blood-cross-match-test-request/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new request</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step request form. One continuous single-page wizard that grades the request
				and flags safety issues on submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/blood-cross-match-test-request/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Vetting dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse incoming requests with their computed appropriateness, identity safety, triage tier,
				and recommendation, and filter by triage and recommendation.
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
					Capture a structured transfusion-compatibility request and produce a graded vetting report —
					four-axis grade, overall recommendation, and safety flags — to support the transfusion
					laboratory.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis grading engine,
					and the safety flags. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with NICE NG24 Blood transfusion, British Society for Haematology (BSH)
					pre-transfusion compatibility guidance, and the Serious Hazards of Transfusion (SHOT)
					recommendations on positive patient identification and the two-sample group-check rule.
				</dd>
			</div>
		</dl>
	</section>
</main>
