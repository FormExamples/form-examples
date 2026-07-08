<script lang="ts">
	// Welcome page: explains the work and offers prominent links to the two
	// working surfaces — the examiner form and the exam-admin dashboard.
	const plural = 'medical-language-speaking-assessments-for-cymraeg';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Asesiad Siarad Iaith Feddygol — Cymraeg
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Medical Language Speaking Assessment for Cymraeg
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A clinical Welsh-language (Cymraeg) speaking assessment for healthcare professionals working
			with Welsh-speaking patients, completed as a single continuous wizard: candidate details, two
			role-plays (Sgwrs gyda Chlaf and Esboniad Clinigol), per-criterion ratings, and overall
			feedback. The shared engine grades fluency, grammar, pronunciation, and clinical
			appropriateness, scores the five clinical-communication indicators, and maps the result to a
			CEFR-aligned grade (A-E) with a 0-500 scaled score and flagged issues, aligned to the NHS Wales
			"More Than Just Words" framework.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href={`/${plural}/new`}
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step examiner form. One continuous single-page wizard that grades the
				candidate as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href={`/${plural}`}
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Exam-admin dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed candidates with their computed CEFR-mapped grade, scaled score, and
				linguistic / clinical totals, and filter by grade and clinical threshold.
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
					Capture a structured Welsh-language clinical-speaking profile and produce a graded report —
					CEFR-mapped grade, scaled score, per-criterion breakdown, and flagged issues — to support
					NHS Wales Welsh-essential role decisions.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the OET-style CEFR-mapped
					grading engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned to the NHS Wales "More Than Just Words" framework and the Welsh Language Standards,
					with CEFR-mapped bands parallel to the OET Medicine grades.
				</dd>
			</div>
		</dl>
	</section>
</main>
