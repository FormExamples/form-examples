<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the evaluation wizard and the review
	// dashboard. The collection routes (`/hernia-diagnostic-evaluations` and
	// `/hernia-diagnostic-evaluations/new`) hold the actual functionality.
	const plural = 'hernia-diagnostic-evaluations';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/hernia-diagnostic-evaluation/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new evaluation</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step hernia diagnostic evaluation. One continuous single-page wizard
				across fourteen steps that classifies the hernia and computes an urgency band as you
				complete it, and saves the draft as you work.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/hernia-diagnostic-evaluation/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded evaluations with their hernia type, reducibility status, urgency band,
				and safety flags, and filter by any of them.
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
					The clinical assessment used to detect, classify, and grade the urgency of an
					abdominal-wall or groin hernia, performed by a GP, surgical registrar, or general
					surgeon. It covers presenting complaint, risk factors, examination findings, and
					imaging, and produces a hernia classification plus an urgency band suitable for the
					clinical record and a referral letter.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Classification and urgency</dt>
				<dd class="mt-1 text-base-content/70">
					European Hernia Society (EHS) classification (type, subtype, laterality, size grade)
					plus reducibility status. The urgency band — routine, soon, urgent, or emergency — is
					computed red-flag-first: any positive red flag forces emergency urgency and is never
					diluted by an otherwise reassuring examination. Safety flags are computed independently
					and are never suppressed by a clinician override.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Relationship to pre-operative assessment</dt>
				<dd class="mt-1 text-base-content/70">
					This form is upstream of the decision to operate: it answers what type of hernia this
					is and whether it needs referral today. A hernia diagnostic evaluation that recommends
					elective repair is the usual referral trigger into the pre-operative assessment forms.
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
					Clinical decision support. It does not make a diagnosis and does not replace the
					clinical judgement of the examining clinician. Any positive red flag requires same-day
					clinical escalation regardless of what the software displays.
				</dd>
			</div>
		</dl>
	</section>
</main>
