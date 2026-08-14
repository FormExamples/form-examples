<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the evaluation wizard and the review
	// dashboard. The collection routes (`/knee-replacement-surgery-evaluations`
	// and `/knee-replacement-surgery-evaluations/new`) hold the actual
	// functionality.
	const plural = 'knee-replacement-surgery-evaluations';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/knee-replacement-surgery-evaluation/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new evaluation</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step knee-replacement surgery evaluation. One continuous single-page
				wizard across fifteen steps that scores the Oxford Knee Score and the surgical-candidacy
				recommendation as you complete it, and saves the draft as you work.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/knee-replacement-surgery-evaluation/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded evaluations with their Oxford Knee Score, surgical candidacy, and safety
				flags, and filter by any of them.
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
					The orthopaedic assessment used by a surgeon or extended-scope physiotherapist in a
					joint-replacement clinic to decide whether a patient is a suitable candidate for total or
					partial knee arthroplasty. It records the presenting history, scores the Oxford Knee
					Score, captures the physical examination and diagnostic imaging, and audits the
					conservative treatment already tried.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Scoring</dt>
				<dd class="mt-1 text-base-content/70">
					The Oxford Knee Score (Dawson et al. 1998) is the primary instrument, with the
					Kellgren-Lawrence radiographic grade as the secondary instrument. The computed surgical
					candidacy is a first-match-wins ordered rule list. Safety flags are computed
					independently and are never suppressed by a clinician override.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">What this form is not</dt>
				<dd class="mt-1 text-base-content/70">
					Not an ASA-grading pre-operative assessment: it does not compute an ASA grade or an
					anaesthesia plan. Its question is whether the patient's knee disease justifies
					replacement surgery, and whether conservative options have been exhausted.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the scoring engine, and the
					safety-flag rules. The same pure engine grades both the form and the dashboard, and the
					HTML front-end runs an identical implementation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Status</dt>
				<dd class="mt-1 text-base-content/70">
					Clinical decision support. It does not make a diagnosis and does not replace the clinical
					judgement of the orthopaedic surgeon or extended-scope physiotherapist, who must sign the
					evaluation before the report is final.
				</dd>
			</div>
		</dl>
	</section>
</main>
