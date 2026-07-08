<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/gastroenterology-assessments` and
	// `/gastroenterology-assessments/new`) hold the actual functionality.
	const plural = 'gastroenterology-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Gastroenterology Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Gastrointestinal symptom evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive gastroenterological evaluation completed as a single continuous wizard:
			demographics, chief complaint, upper GI symptoms, lower GI symptoms, abdominal pain, liver and
			pancreas, previous GI history, current medications, allergies and diet, and red flags / social
			history. The shared engine sums weighted GI scoring rules into a composite symptom-severity
			score, classifies it from minimal to very severe, and flags safety-critical issues for the
			gastroenterologist.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/gastroenterology-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that grades the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/gastroenterology-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed GI severity score and level, and filter by
				severity level and red-flag presence.
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
					Capture a structured GI symptom profile and produce a graded report — composite severity
					score, severity level, and flagged red-flag issues — to support gastroenterology review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the weighted GI severity
					scoring engine, and the red-flag detection rules. The same engine grades both the form and
					the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Covers upper and lower GI symptoms, abdominal pain, liver / pancreas function, and red-flag
					detection (rectal bleeding, dysphagia, weight loss, jaundice, family history).
				</dd>
			</div>
		</dl>
	</section>
</main>
