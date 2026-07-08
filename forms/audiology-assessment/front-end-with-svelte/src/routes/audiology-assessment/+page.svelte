<script lang="ts">
	const plural = 'audiology-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Audiology Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Comprehensive hearing evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A single continuous wizard covering demographics, chief complaint, hearing history, audiometric
			results, tinnitus, vestibular symptoms, otoscopy, medical history, and functional communication.
			The shared engine derives a hearing-level grade from the pure-tone average and flags
			safety-critical issues for the audiologist.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/audiology-assessment/{plural}/new"
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
			href="/audiology-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed hearing-level grade.
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
					Capture a structured hearing profile and produce a graded report — hearing-level grade and
					flagged issues — to support audiology review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the hearing-grade engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses pure-tone-average (dB HL) hearing-level grading: normal, mild, moderate, severe, and
					profound.
				</dd>
			</div>
		</dl>
	</section>
</main>
