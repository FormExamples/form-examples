<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'child-pugh-scores';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Child-Pugh Score (Child-Turcotte-Pugh)
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Prognostic grading for chronic liver disease
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Grade five parameters — total bilirubin, serum albumin, INR (or prothrombin time), ascites, and
			hepatic encephalopathy — in a single continuous wizard. The shared engine scores each parameter
			1, 2, or 3 points, sums a total of 5-15, and assigns a class: Class A (5-6), Class B (7-9), or
			Class C (10-15), each mapped to one- and two-year survival and peri-operative mortality risk.
			Decompensated (Class C) disease, overt encephalopathy, refractory ascites, and severe
			coagulopathy are flagged for action.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/child-pugh-score/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment. One continuous single-page wizard that scores and classes
				the liver disease as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/child-pugh-score/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed Child-Pugh score, class, and surgical risk, and
				filter by care setting and class.
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
					Stratify the severity of chronic liver disease to support prognosis, transplant assessment,
					and surgical-risk discussion — a graded report with the total, class, per-parameter points,
					and flagged issues.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the per-parameter thresholds,
					the class bands, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Child &amp; Turcotte (1964), Pugh et al. (Br J Surg 1973), EASL decompensated-
					cirrhosis guidance, and NICE NG50. A prognostic aid, not a substitute for clinical judgement
					or an organ-allocation score (MELD / UKELD).
				</dd>
			</div>
		</dl>
	</section>
</main>
