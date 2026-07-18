<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'has-bled-score-for-major-bleeding-risks';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			HAS-BLED Score for Major Bleeding Risk
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">HAS-BLED bleeding-risk score</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A bleeding-risk score for adults with atrial fibrillation on, or being considered for, oral
			anticoagulation, completed as a single continuous wizard, that sums nine clinical criteria into
			a total of 0 to 9 and flags a score of 3 or more as higher bleeding risk.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/has-bled-score-for-major-bleeding-risk/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step HAS-BLED score. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/has-bled-score-for-major-bleeding-risk/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed HAS-BLED score and risk band, and filter by care
				setting and risk band.
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
					Capture the nine HAS-BLED criteria — Hypertension (SBP &gt; 160), Abnormal renal function,
					Abnormal liver function, Stroke, Bleeding history, Labile INR, Elderly (age &gt; 65), Drugs
					(antiplatelets/NSAIDs), and Alcohol (&ge; 8 units/week) — and produce a graded report: score
					0-9, risk band, and flagged issues, to support anticoagulation decisions and surface
					correctable bleeding-risk factors. A high score is not a contraindication to anticoagulation;
					read it alongside CHA&#8322;DS&#8322;-VASc.
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
					Drawn from Pisters et al. (Chest 2010), the 2020 ESC AF guidelines, and NICE NG196. A
					risk-communication tool, not a contraindication to anticoagulation.
				</dd>
			</div>
		</dl>
	</section>
</main>
