<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'cage-alcohol-questionnaires';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			CAGE Alcohol Questionnaire
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			CAGE four-item alcohol-misuse screen
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A brief screen for alcohol misuse and dependence in adults, completed as a single continuous
			wizard. Four lifetime yes/no questions — <strong>C</strong>ut down, <strong>A</strong>nnoyed,
			<strong>G</strong>uilty, and <strong>E</strong>ye-opener — each score 1 point for a "yes",
			for a total of 0 to 4. The shared engine sums the score, derives the result band, and flags
			CAGE &ge; 2 as a positive screen that prompts a fuller assessment of drinking. A "yes" to the
			eye-opener question is a marker of physical dependence.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/cage-alcohol-questionnaire/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step CAGE screen. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/cage-alcohol-questionnaire/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed CAGE score and result band, and filter by care
				setting and result band.
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
					Capture the four CAGE criteria and produce a graded report — score 0-4, result band, and
					flagged issues — to support timely follow-up of problem drinking.
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
					Drawn from Ewing (JAMA 1984) and Mayfield et al. (1974). A screening prompt, not a
					diagnosis of an alcohol-use disorder.
				</dd>
			</div>
		</dl>
	</section>
</main>
