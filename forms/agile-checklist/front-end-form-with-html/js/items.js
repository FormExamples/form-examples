// Public exports attached to window.AgileChecklist.
(function () {
  'use strict';

  const TEAMS_ITEMS = [
    { id: 't01', ordinal: 1, section: 'teams', text: 'Teams have problems to solve rather than lists of tasks to perform.' },
    { id: 't02', ordinal: 2, section: 'teams', text: "Teams generally make decisions without a manager's approval." },
    { id: 't03', ordinal: 3, section: 'teams', text: 'Teams adopt appropriate practices and improve them over time.' },
    { id: 't04', ordinal: 4, section: 'teams', text: 'Teams working on a common product actively coordinate.' },
    { id: 't05', ordinal: 5, section: 'teams', text: 'Teams openly share new ideas and experiences with others.' },
    { id: 't06', ordinal: 6, section: 'teams', text: 'Teams decide how to execute work.' },
    { id: 't07', ordinal: 7, section: 'teams', text: 'Teams quickly act on stakeholder feedback to improve the product.' },
    { id: 't08', ordinal: 8, section: 'teams', text: 'Teams rarely wait for work to be completed by others.' },
    { id: 't09', ordinal: 9, section: 'teams', text: 'Teams make every effort to fully complete all planned work.' },
    { id: 't10', ordinal: 10, section: 'teams', text: 'Teams monitor and manage their own performance.' },
    { id: 't11', ordinal: 11, section: 'teams', text: 'Teams understand the benefits and challenges of agile.' },
    { id: 't12', ordinal: 12, section: 'teams', text: 'Teams responsibly deliver high quality work.' },
    { id: 't13', ordinal: 13, section: 'teams', text: 'Teams welcome rather than resist changing requirements.' },
    { id: 't14', ordinal: 14, section: 'teams', text: 'Teams collaborate to finish items.' },
    { id: 't15', ordinal: 15, section: 'teams', text: 'Teams admit challenges and mistakes.' },
    { id: 't16', ordinal: 16, section: 'teams', text: 'Teams can work outside their specialties to achieve goals.' },
    { id: 't17', ordinal: 17, section: 'teams', text: 'Teams seek to learn relevant, new skills.' },
    { id: 't18', ordinal: 18, section: 'teams', text: 'Teams continue to learn and improve skills.' },
    { id: 't19', ordinal: 19, section: 'teams', text: 'Teams actively seek ways to improve ways of working.' },
    { id: 't20', ordinal: 20, section: 'teams', text: 'Teams choose and use various ways of communicating.' },
    { id: 't21', ordinal: 21, section: 'teams', text: 'Teams have all received basic training on agile concepts.' },
    { id: 't22', ordinal: 22, section: 'teams', text: 'Teams feel safe to express dissenting views.' },
    { id: 't23', ordinal: 23, section: 'teams', text: 'Teams start work even when some open issues remain.' },
    { id: 't24', ordinal: 24, section: 'teams', text: 'Teams are motivated by performing their work.' },
    { id: 't25', ordinal: 25, section: 'teams', text: 'Teams take pride in their craft.' },
  ];

  const STAKEHOLDERS_ITEMS = [
    { id: 's01', ordinal: 1, section: 'stakeholders', text: 'Stakeholders know which factors determine priorities and deadlines.' },
    { id: 's02', ordinal: 2, section: 'stakeholders', text: 'Stakeholders accept plans that are expressed with ranges.' },
    { id: 's03', ordinal: 3, section: 'stakeholders', text: 'Stakeholders and the team accept that plans may need to change.' },
    { id: 's04', ordinal: 4, section: 'stakeholders', text: 'Stakeholders have frequent opportunities to evaluate the product.' },
    { id: 's05', ordinal: 5, section: 'stakeholders', text: 'Stakeholders champion agile values and agile principles.' },
    { id: 's06', ordinal: 6, section: 'stakeholders', text: 'Stakeholders see quality as a right that the team has and they respect it.' },
    { id: 's07', ordinal: 7, section: 'stakeholders', text: 'Stakeholders delegate authority to teams.' },
    { id: 's08', ordinal: 8, section: 'stakeholders', text: "Stakeholders don't take authority back at the first sign of trouble." },
    { id: 's09', ordinal: 9, section: 'stakeholders', text: 'Stakeholders support teams in experimenting.' },
    { id: 's10', ordinal: 10, section: 'stakeholders', text: "Stakeholders don't punish an unsuccessful experiment." },
    { id: 's11', ordinal: 11, section: 'stakeholders', text: 'Stakeholders communicate what they hope to achieve by becoming more agile.' },
    { id: 's12', ordinal: 12, section: 'stakeholders', text: 'Stakeholders actively encourage teams to learn new skills.' },
    { id: 's13', ordinal: 13, section: 'stakeholders', text: 'Stakeholders actively encourage teams to learn new ways of working.' },
    { id: 's14', ordinal: 14, section: 'stakeholders', text: 'Stakeholders develop people rather than manage their performance.' },
  ];

  const PRACTICES_ITEMS = [
    { id: 'p01', ordinal: 1, section: 'practices', text: 'The early release of a good product is generally favoured over the later release of a perfect product.' },
    { id: 'p02', ordinal: 2, section: 'practices', text: 'An educated executive sponsor ensures the change agent is empowered to make decisions.' },
    { id: 'p03', ordinal: 3, section: 'practices', text: 'Decisions are made quickly, sometimes with incomplete knowledge.' },
    { id: 'p04', ordinal: 4, section: 'practices', text: 'Plans are based on data and experience.' },
    { id: 'p05', ordinal: 5, section: 'practices', text: 'Dependencies between teams are proactively identified and addressed.' },
    { id: 'p06', ordinal: 6, section: 'practices', text: 'People are assumed to have acted with good intentions even when something goes wrong.' },
    { id: 'p07', ordinal: 7, section: 'practices', text: 'Trust is reciprocal within the team and with stakeholders.' },
    { id: 'p08', ordinal: 8, section: 'practices', text: 'Although formal documentation may exist, it is supplemented by conversations to the extent possible.' },
    { id: 'p09', ordinal: 9, section: 'practices', text: 'As more is learned, plans are updated rather than remaining based on outdated information.' },
    { id: 'p10', ordinal: 10, section: 'practices', text: "A non-punitive attitude leads to the team's willingness to experiment with new tools, technologies, and ways of working." },
    { id: 'p11', ordinal: 11, section: 'practices', text: 'Outside groups that partner with the team are aware of how this new way of working may affect their interactions.' },
    { id: 'p12', ordinal: 12, section: 'practices', text: 'The organisation places a higher value on finished work than it does on the number of work items in process.' },
    { id: 'p13', ordinal: 13, section: 'practices', text: 'Quality is rarely, if ever, sacrificed to meet a deadline.' },
    { id: 'p14', ordinal: 14, section: 'practices', text: 'When problems arise between teams, everyone focuses on a solution rather than blame.' },
    { id: 'p15', ordinal: 15, section: 'practices', text: 'Change agents are in place to help support and guide the transition.' },
    { id: 'p16', ordinal: 16, section: 'practices', text: 'Agile practices are being implemented beyond the group in which agile began.' },
    { id: 'p17', ordinal: 17, section: 'practices', text: 'Most people are assigned to only one team.' },
    { id: 'p18', ordinal: 18, section: 'practices', text: 'People honour commitments and keep promises.' },
  ];

  const ALL_ITEMS = TEAMS_ITEMS.concat(STAKEHOLDERS_ITEMS).concat(PRACTICES_ITEMS);

  const SECTION_LABEL = {
    teams: 'Teams',
    stakeholders: 'Stakeholders',
    practices: 'Practices',
  };

  window.AgileChecklist = window.AgileChecklist || {};
  window.AgileChecklist.TEAMS_ITEMS = TEAMS_ITEMS;
  window.AgileChecklist.STAKEHOLDERS_ITEMS = STAKEHOLDERS_ITEMS;
  window.AgileChecklist.PRACTICES_ITEMS = PRACTICES_ITEMS;
  window.AgileChecklist.ALL_ITEMS = ALL_ITEMS;
  window.AgileChecklist.SECTION_LABEL = SECTION_LABEL;
})();
