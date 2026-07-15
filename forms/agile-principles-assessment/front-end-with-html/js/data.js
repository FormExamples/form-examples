  

  export const SAMPLE_ASSESSMENTS = [
    { id: 'A001', date: '2025-07-15', respondent: 'Alice Hopper', role: 'scrum-master', team: 'Aurora', organisation: 'Acme Engineering', answered: 12, meanScore: 3.42, maturity: 'developing', weakPrinciples: ['P3 Deliver frequently', 'P9 Technical excellence'], flags: ['slow-delivery', 'technical-debt'] },
    { id: 'A002', date: '2025-10-15', respondent: 'Alice Hopper', role: 'scrum-master', team: 'Aurora', organisation: 'Acme Engineering', answered: 12, meanScore: 3.83, maturity: 'mature', weakPrinciples: ['P9 Technical excellence'], flags: ['technical-debt'] },
    { id: 'A003', date: '2026-01-15', respondent: 'Alice Hopper', role: 'scrum-master', team: 'Aurora', organisation: 'Acme Engineering', answered: 12, meanScore: 4.25, maturity: 'mature', weakPrinciples: [], flags: [] },
    { id: 'A004', date: '2026-04-12', respondent: 'Alice Hopper', role: 'scrum-master', team: 'Aurora', organisation: 'Acme Engineering', answered: 12, meanScore: 4.58, maturity: 'optimising', weakPrinciples: [], flags: [] },

    { id: 'A005', date: '2025-10-13', respondent: 'Ben Carter', role: 'engineering-manager', team: 'Borealis', organisation: 'Acme Engineering', answered: 12, meanScore: 3.75, maturity: 'mature', weakPrinciples: ['P10 Simplicity'], flags: ['over-engineering'] },
    { id: 'A006', date: '2026-01-13', respondent: 'Ben Carter', role: 'engineering-manager', team: 'Borealis', organisation: 'Acme Engineering', answered: 12, meanScore: 3.83, maturity: 'mature', weakPrinciples: ['P10 Simplicity'], flags: ['over-engineering'] },
    { id: 'A007', date: '2026-04-13', respondent: 'Ben Carter', role: 'engineering-manager', team: 'Borealis', organisation: 'Acme Engineering', answered: 12, meanScore: 3.92, maturity: 'mature', weakPrinciples: ['P10 Simplicity'], flags: ['over-engineering'] },

    { id: 'A008', date: '2025-10-15', respondent: 'Chris Diaz', role: 'product-owner', team: 'Cygnus', organisation: 'Acme Engineering', answered: 12, meanScore: 3.83, maturity: 'mature', weakPrinciples: [], flags: [] },
    { id: 'A009', date: '2026-01-15', respondent: 'Chris Diaz', role: 'product-owner', team: 'Cygnus', organisation: 'Acme Engineering', answered: 12, meanScore: 3.42, maturity: 'developing', weakPrinciples: ['P3 Deliver frequently'], flags: ['slow-delivery'] },
    { id: 'A010', date: '2026-04-15', respondent: 'Chris Diaz', role: 'product-owner', team: 'Cygnus', organisation: 'Acme Engineering', answered: 12, meanScore: 3.17, maturity: 'developing', weakPrinciples: ['P3 Deliver frequently', 'P9 Technical excellence'], flags: ['slow-delivery', 'technical-debt'] },

    { id: 'A011', date: '2026-01-16', respondent: 'Dana Patel', role: 'agile-coach', team: 'Draco', organisation: 'Acme Engineering', answered: 12, meanScore: 2.92, maturity: 'initial', weakPrinciples: ['P5 Motivated individuals', 'P11 Self-organising teams'], flags: ['morale-risk', 'command-and-control'] },
    { id: 'A012', date: '2026-04-16', respondent: 'Dana Patel', role: 'agile-coach', team: 'Draco', organisation: 'Acme Engineering', answered: 12, meanScore: 2.42, maturity: 'initial', weakPrinciples: ['P5 Motivated individuals', 'P8 Sustainable development', 'P11 Self-organising teams', 'P12 Regular reflection'], flags: ['burnout-risk', 'command-and-control', 'no-retrospective', 'morale-risk'] },

    { id: 'A013', date: '2026-04-17', respondent: 'Eli Singh', role: 'individual-contributor', team: 'Eridanus', organisation: 'Acme Engineering', answered: 12, meanScore: 1.83, maturity: 'ad-hoc', weakPrinciples: ['P1 Customer satisfaction', 'P2 Welcome change', 'P9 Technical excellence', 'P12 Regular reflection'], flags: ['customer-disconnect', 'change-resistance', 'technical-debt', 'no-retrospective', 'critical-principle-gap'] },
    { id: 'A013b', date: '2026-04-19', respondent: 'Anonymous', role: '', team: 'Eridanus', organisation: 'Acme Engineering', answered: 12, meanScore: 2.17, maturity: 'initial', weakPrinciples: ['P5 Motivated individuals', 'P8 Sustainable development'], flags: ['burnout-risk', 'morale-risk'], isAnonymous: true },

    { id: 'A014', date: '2026-04-18', respondent: 'Farah Lopez', role: 'team-lead', team: 'Fornax', organisation: 'Acme Engineering', answered: 4, meanScore: null, maturity: 'insufficient-data', weakPrinciples: [], flags: ['insufficient-data'] },
  ];
