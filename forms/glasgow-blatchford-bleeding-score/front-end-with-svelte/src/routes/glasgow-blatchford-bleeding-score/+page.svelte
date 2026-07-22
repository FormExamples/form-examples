<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'glasgow-blatchford-bleeding-scores';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/glasgow-blatchford-bleeding-score/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment. One continuous single-page wizard that scores and bands the
				bleeding risk as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/glasgow-blatchford-bleeding-score/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed Glasgow-Blatchford score and risk band, and
				filter by care setting and risk band.
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
					Stratify the risk that a patient with suspected acute upper GI bleeding will need
					intervention or transfusion: a total of 0 is very-low risk (consider outpatient management),
					1-5 is low-moderate risk, and 6 or more is high risk (admit and arrange urgent endoscopy) — a
					graded report with the total, risk band, per-parameter points, and flagged issues
					(haemodynamic instability, severe anaemia, and high scores) to support the admit-or-discharge
					decision.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the per-parameter bands
					(including the sex-specific haemoglobin table), the risk-band boundaries, and the flag
					rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Blatchford, Murray &amp; Blatchford (Lancet 2000) and NICE CG141. A
					decision-support score, not a diagnosis; it does not replace resuscitation of the unstable
					patient or the post-endoscopy Rockall score.
				</dd>
			</div>
		</dl>
	</section>
</main>
