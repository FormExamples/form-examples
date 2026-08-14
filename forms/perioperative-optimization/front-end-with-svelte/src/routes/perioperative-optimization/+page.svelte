<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment wizard and the
	// waiting-list dashboard.
	const plural = 'perioperative-optimizations';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/perioperative-optimization/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step optimisation intake. One continuous single-page wizard across sixteen
				steps that grades eight domains against the time remaining before surgery.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/perioperative-optimization/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				See surgical readiness and weeks to surgery across the waiting list, and which lists are at
				risk of proceeding unoptimised.
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
					Perioperative optimisation is the active process of identifying, treating, and improving
					reversible health problems before surgery, so that complications fall, stays shorten, and
					the body copes better with the stress of the operation. This form is the screening intake a
					surgical or anaesthetic team uses to do that, and to build a personalised prehabilitation
					plan.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">What makes it different</dt>
				<dd class="mt-1 text-base-content/70">
					It does not compute an ASA grade — three sibling forms already do. ASA answers <em>how
					risky is this patient?</em>, a question whose answer the team cannot change. This form
					answers <em>what is still fixable, and is there time to fix it?</em> A patient can be ASA
					III and fully optimised, or ASA II with an untreated iron deficiency that four weeks of
					intravenous iron would resolve.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Time-to-surgery gating</dt>
				<dd class="mt-1 text-base-content/70">
					Each of the eight domains carries a lead time: the minimum weeks its intervention needs in
					order to work. Four weeks of smoking cessation, twelve to move an HbA1c, eight weeks of
					oral iron or four of intravenous. The engine gates every finding against the weeks
					remaining, so a finding becomes a decision. Where there is not enough time, the band is
					<strong>Defer surgery</strong> and the team must either move the date or record an explicit
					accept-unoptimised-risk decision.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Scoring</dt>
				<dd class="mt-1 text-base-content/70">
					Thresholds follow NHS England's perioperative-pathway guidance, CPOC's optimisation,
					anaemia, and diabetes guidelines, NICE NG45 and NG180, and the source papers for MUST,
					AUDIT-C, the Duke Activity Status Index, STOP-BANG, and the Clinical Frailty Scale.
					Surgical readiness uses max-grade: the worst domain sets the band. Safety flags are
					computed independently and are never suppressed by a clinician override.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Status</dt>
				<dd class="mt-1 text-base-content/70">
					Clinical decision support. It does not diagnose and does not decide whether surgery goes
					ahead: the responsible surgical and anaesthetic team records an explicit gate decision at
					sign-off.
				</dd>
			</div>
		</dl>
	</section>
</main>
