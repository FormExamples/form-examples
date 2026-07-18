<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'wells-score-for-pulmonary-embolisms';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Wells Score for Pulmonary Embolism
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Wells PE pre-test probability rule</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A bedside clinical prediction rule that sums seven weighted criteria into a Wells score of 0 to
			12.5 to stratify an adult with suspected acute pulmonary embolism as likely (CTPA) or unlikely
			(D-dimer).
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/wells-score-for-pulmonary-embolism/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step Wells PE rule. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form &rarr;</span>
		</a>
		<a
			href="/wells-score-for-pulmonary-embolism/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed Wells score and two-level band, and filter by
				care setting and band.
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
					Capture the seven weighted Wells criteria &mdash; clinical signs of DVT (+3), PE most
					likely (+3), heart rate &gt; 100 (+1.5), immobilisation or recent surgery (+1.5),
					previous DVT/PE (+1.5), haemoptysis (+1), and malignancy (+1) &mdash; and the patient's
					haemodynamic status, and produce a graded report &mdash; total score (0 to 12.5),
					two-level and three-level bands, recommended pathway, and flagged issues &mdash; to
					direct the diagnostic pathway.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the additive weighted scoring
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Wells et al. (Thromb Haemost 2000; Ann Intern Med 2001), NICE NG158, and the
					PERC rule. The output selects the next diagnostic step; it does not diagnose or exclude PE
					on its own.
				</dd>
			</div>
		</dl>
	</section>
</main>
