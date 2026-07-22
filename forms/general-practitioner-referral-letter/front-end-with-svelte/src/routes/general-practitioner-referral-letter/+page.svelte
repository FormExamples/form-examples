<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the referral form and the referrals
	// dashboard.
	const plural = 'general-practitioner-referral-letters';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/general-practitioner-referral-letter/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new referral</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step referral. One continuous single-page wizard that shows the live
				completeness status and urgency as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/general-practitioner-referral-letter/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Referrals dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse referrals with their computed completeness status and urgency classification, and
				filter by status and urgency.
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
					Structure and route a referral — capturing the referrer and patient details, the referral
					destination, urgency, reason and history, examination and investigation findings,
					medications and allergies, and the patient's expectations, consent, and safety-netting —
					into a completeness status, a completeness percentage, an echoed urgency classification
					(routine, urgent, two-week-wait suspected cancer, or emergency), mandatory-field results,
					and flags — not a clinical score. It checks the letter, not the patient.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the urgency-dependent
					mandatory-field completeness rules, the urgency classification, and the flag rules. The
					same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Grounded in the NHS e-Referral Service standards and NICE NG12 (suspected cancer). The
					urgency is always echoed — even for an incomplete referral — so the correct pathway is
					never hidden. Consent follows Montgomery v Lanarkshire Health Board (2015).
				</dd>
			</div>
		</dl>
	</section>
</main>
