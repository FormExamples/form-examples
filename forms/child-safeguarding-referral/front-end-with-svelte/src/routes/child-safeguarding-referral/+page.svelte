<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the referral form and the duty-team
	// dashboard.
	const plural = 'child-safeguarding-referrals';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Child Safeguarding Referral
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Refer a child to children’s social care</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured referral to children’s social care when a professional believes a child may be
			at risk of harm, completed as a single continuous wizard. It records the referrer and child
			details, the concern or allegation, the category of abuse, immediate risk and safety, the
			consent / information-sharing basis, who else has been informed, and the action requested.
			This is a documentation-completeness and risk-classification instrument, not a score: the
			shared engine grades the referral complete, partial, or incomplete, classifies its urgency
			(emergency, urgent s47, or standard s17), and raises safeguarding flags.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/child-safeguarding-referral/{plural}/new"
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
			href="/child-safeguarding-referral/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Duty-team dashboard</h2>
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
					Record and route a referral — a completeness status, an urgency classification,
					mandatory-requirement results, and safeguarding flags — not a clinical score.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the mandatory completeness
					rules, the urgency classification, and the flag rules. The same engine grades both the
					form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Grounded in Working Together to Safeguard Children (2023), the Children Act 1989
					(sections 17 and 47), Keeping Children Safe in Education, and the Information Sharing
					guidance (2018). Urgency is always computed — even for an incomplete referral — so danger
					is never hidden.
				</dd>
			</div>
		</dl>
	</section>
</main>
