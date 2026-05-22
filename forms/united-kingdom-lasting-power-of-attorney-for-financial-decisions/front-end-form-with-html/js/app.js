/* United Kingdom LPA for Financial Decisions — Alpine.js wizard glue.
 *
 * Registers an Alpine.data factory `lpaWizard()` that:
 *   - holds the LPA in `state`
 *   - exposes helpers for adding / removing attorneys, replacements, etc.
 *   - re-runs validateLpa() on every state change (via $watch) into
 *     `validation` ({ validityBand, compositeRisk, firedRules, additionalFlags })
 *   - persists to localStorage under the key below
 *   - knows how to load the sample fixture
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'uk-lpa-financial.front-end-form-with-html.v1';

  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function saveState(s) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (e) { /* ignore quota issues */ }
  }

  function makePerson() { return window.LpaValidator.emptyPerson(); }
  function makeWitness() { return window.LpaValidator.emptyWitness(); }
  function makePtN() {
    return {
      title: '',
      firstNames: '',
      lastName: '',
      addressLine1: '',
      postcode: ''
    };
  }
  function makeSignature() {
    return {
      present: false,
      signedAt: null,
      witness: makeWitness()
    };
  }

  document.addEventListener('alpine:init', function () {
    window.Alpine.data('lpaWizard', function () {
      return {
        steps: [
          { n: 1, title: 'Donor', section: 'LP1F section 1' },
          { n: 2, title: 'Attorneys', section: 'LP1F section 2' },
          { n: 3, title: 'How attorneys make decisions', section: 'LP1F section 3' },
          { n: 4, title: 'Replacement attorneys', section: 'LP1F section 4' },
          { n: 5, title: 'When attorneys can act', section: 'LP1F section 5' },
          { n: 6, title: 'People to notify', section: 'LP1F section 6' },
          { n: 7, title: 'Preferences and instructions', section: 'LP1F section 7' },
          { n: 8, title: 'Legal rights', section: 'LP1F section 8' },
          { n: 9, title: 'Donor signature', section: 'LP1F section 9' },
          { n: 10, title: 'Certificate-provider signature', section: 'LP1F section 10' },
          { n: 11, title: 'Attorney signatures', section: 'LP1F section 11' },
          { n: 12, title: 'Applicant', section: 'LP1F section 12' },
          { n: 13, title: 'Who receives the LPA', section: 'LP1F section 13' },
          { n: 14, title: 'Application fee', section: 'LP1F section 14' },
          { n: 15, title: 'Registration signature', section: 'LP1F section 15' }
        ],

        state: loadState() || window.LpaValidator.emptyLpa(),
        validation: { validityBand: 'draft', compositeRisk: 'low', firedRules: [], additionalFlags: [] },

        init: function () {
          this.runValidation();
          this.$watch('state', () => {
            this.runValidation();
            saveState(this.state);
          });
        },

        runValidation: function () {
          this.validation = window.validateLpa(this.state);
        },

        // --- mutations -----------------------------------------------

        addAttorney: function () { this.state.attorneys.push(makePerson()); this.state.attorneySignatures.push(makeSignature()); },
        removeAttorney: function (i) {
          this.state.attorneys.splice(i, 1);
          this.state.attorneySignatures.splice(i, 1);
        },
        addReplacement: function () { this.state.replacementAttorneys.push(makePerson()); this.state.replacementSignatures.push(makeSignature()); },
        removeReplacement: function (i) {
          this.state.replacementAttorneys.splice(i, 1);
          this.state.replacementSignatures.splice(i, 1);
        },
        addPersonToNotify: function () {
          if ((this.state.peopleToNotify || []).length >= 5) return;
          this.state.peopleToNotify.push(makePtN());
        },
        removePersonToNotify: function (i) { this.state.peopleToNotify.splice(i, 1); },

        ensureAttorneySignature: function (i) {
          while (this.state.attorneySignatures.length <= i) this.state.attorneySignatures.push(makeSignature());
        },

        // --- demo / reset --------------------------------------------

        loadSample: function () {
          this.state = deepClone(window.LpaSampleData);
        },
        resetAll: function () {
          if (!confirm('Discard all entered data and start over?')) return;
          this.state = window.LpaValidator.emptyLpa();
          try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
        },

        // --- presentation helpers ------------------------------------

        riskBadgeClass: function (priority) {
          return 'badge badge-' + (priority || 'low');
        },

        ruleClass: function (priority) {
          return 'rule-' + (priority || 'low');
        },

        attorneyCount: function () { return (this.state.attorneys || []).length; },
        replacementCount: function () { return (this.state.replacementAttorneys || []).length; },
        ptnCount: function () { return (this.state.peopleToNotify || []).length; }
      };
    });
  });
})();
