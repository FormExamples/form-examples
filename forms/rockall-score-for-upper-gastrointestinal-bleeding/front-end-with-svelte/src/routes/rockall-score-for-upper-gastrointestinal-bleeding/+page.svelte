<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'rockall-scores-for-upper-gastrointestinal-bleeding';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Rockall Score for Upper Gastrointestinal Bleeding
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Risk stratification for acute upper GI bleeding
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A single continuous wizard that scores clinical and, when available, endoscopic parameters to
			stratify the risk of rebleeding and death from acute upper gastrointestinal bleeding.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/rockall-score-for-upper-gastrointestinal-bleeding/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment. One continuous single-page wizard that scores and bands the
				bleed risk as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/rockall-score-for-upper-gastrointestinal-bleeding/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed clinical and full Rockall scores and risk band,
				and filter by care setting and band.
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
					Stratify the risk of rebleeding and death after acute upper GI bleeding — scoring age,
					shock (from heart rate and systolic blood pressure), and comorbidity for a pre-endoscopy
					(clinical) score of 0-7, and diagnosis and stigmata of recent haemorrhage for a full
					(post-endoscopy) score of 0-11, where a full score of 2 or below identifies a low-risk
					group — to support admission, monitoring, and escalation decisions, flagging shock,
					high-risk stigmata, upper GI malignancy, and high total scores for action.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the per-parameter thresholds,
					the shock derivation, the risk bands, and the flag rules. The same engine grades both the
					form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Rockall et al. (Gut 1996), NICE CG141, and related upper-GI-bleeding guidance. A
					risk estimate and escalation prompt, not a diagnostic or treatment decision.
				</dd>
			</div>
		</dl>
	</section>
</main>
