/* UK LPA Dashboard — Alpine.js app.
 * Sortable, filterable review table backed by sample fixtures.
 */
(function () {
  'use strict';

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toISOString().slice(0, 10);
  }

  function formatMode(m) {
    switch (m) {
      case 'single_attorney': return 'Single';
      case 'jointly_and_severally': return 'Jointly & severally';
      case 'jointly': return 'Jointly';
      case 'mixed': return 'Mixed';
      default: return '—';
    }
  }

  function formatWhen(w) {
    switch (w) {
      case 'as_soon_as_registered': return 'As soon as registered';
      case 'only_when_no_capacity': return 'Only when no capacity';
      default: return '—';
    }
  }

  function formatBand(b) { return (b || '').replace(/_/g, ' '); }

  function bandClass(b) {
    if (b === 'registered') return 'badge badge-status-registered';
    if (b === 'submitted') return 'badge badge-status-submitted';
    if (b === 'rejected') return 'badge badge-status-rejected';
    if (b === 'draft') return 'badge badge-status-draft';
    return 'badge badge-band';
  }
  function riskClass(r) { return 'badge badge-' + (r || 'low'); }

  document.addEventListener('alpine:init', function () {
    window.Alpine.data('lpaDashboard', function () {
      return {
        rows: window.LpaDashboardSampleData || [],
        filters: {
          search: '',
          risk: '',
          band: '',
          mode: '',
          status: ''
        },
        sortKey: 'createdAt',
        sortDir: 'desc',

        columns: [
          { key: 'donorName',           label: 'Donor name' },
          { key: 'attorneyCount',       label: 'Attorneys' },
          { key: 'decisionMode',        label: 'Decision mode' },
          { key: 'whenAttorneysCanAct', label: 'When-act' },
          { key: 'replacementCount',    label: 'Replacements' },
          { key: 'peopleToNotifyCount', label: 'People to notify' },
          { key: 'validityBand',        label: 'Validity band' },
          { key: 'compositeRisk',       label: 'Composite risk' },
          { key: 'opgStatus',           label: 'OPG status' },
          { key: 'createdAt',           label: 'Created' }
        ],

        formatDate: formatDate,
        formatMode: formatMode,
        formatWhen: formatWhen,
        formatBand: formatBand,
        bandClass: bandClass,
        riskClass: riskClass,

        toggleSort: function (k) {
          if (this.sortKey === k) {
            this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
          } else {
            this.sortKey = k;
            this.sortDir = 'asc';
          }
        },

        sortIndicator: function (k) {
          if (this.sortKey !== k) return '';
          return this.sortDir === 'asc' ? '\u25B2' : '\u25BC';
        },

        get filteredRows() {
          const f = this.filters;
          const q = (f.search || '').toLowerCase().trim();
          let out = (this.rows || []).filter(r => {
            if (q && !((r.donorName || '').toLowerCase().includes(q))) return false;
            if (f.risk && r.compositeRisk !== f.risk) return false;
            if (f.band && r.validityBand !== f.band) return false;
            if (f.mode && r.decisionMode !== f.mode) return false;
            if (f.status && r.opgStatus !== f.status) return false;
            return true;
          });
          const k = this.sortKey;
          const dir = this.sortDir === 'asc' ? 1 : -1;
          out = out.slice().sort((a, b) => {
            const va = a[k];
            const vb = b[k];
            if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
            return String(va || '').localeCompare(String(vb || '')) * dir;
          });
          return out;
        },

        clearFilters: function () {
          this.filters = { search: '', risk: '', band: '', mode: '', status: '' };
        },

        hasActiveFilters: function () {
          const f = this.filters;
          return !!(f.search || f.risk || f.band || f.mode || f.status);
        }
      };
    });
  });
})();
