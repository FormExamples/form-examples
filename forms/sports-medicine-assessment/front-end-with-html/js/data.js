// Sample athlete data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every PPE 5th-ed. clearance category, a mix
// of sports (football, basketball, swimming, gymnastics, cricket, rugby,
// athletics, hockey), all three contact levels, all four age bands, and a
// realistic mix of risk flags (concussion history, RED-S, family CV
// history); NHS numbers in the canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').AthleteRow[]} */
const sampleAthletes = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    athleteName: 'Smith, Jane',
    age: 24,
    ageBand: 'Adult',
    sport: 'Athletics',
    position: 'Sprinter (100m)',
    contactLevel: 'Non-Contact',
    clearance: 'Cleared',
    concussionHistory: false,
    redS: false,
    familyCardiovascular: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    athleteName: 'Patel, Priya',
    age: 16,
    ageBand: 'Adolescent',
    sport: 'Gymnastics',
    position: 'All-Around',
    contactLevel: 'Limited Contact',
    clearance: 'Cleared with Conditions',
    concussionHistory: false,
    redS: true,
    familyCardiovascular: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    athleteName: 'Jones, Margaret',
    age: 19,
    ageBand: 'Adult',
    sport: 'Football',
    position: 'Midfielder',
    contactLevel: 'Contact',
    clearance: 'Not Cleared Pending Further Evaluation',
    concussionHistory: true,
    redS: false,
    familyCardiovascular: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    athleteName: 'Williams, David',
    age: 22,
    ageBand: 'Adult',
    sport: 'Rugby',
    position: 'Flanker',
    contactLevel: 'Contact',
    clearance: 'Not Cleared for Sport',
    concussionHistory: true,
    redS: false,
    familyCardiovascular: true
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    athleteName: 'Brown, Sarah',
    age: 11,
    ageBand: 'Youth',
    sport: 'Swimming',
    position: 'Freestyle Distance',
    contactLevel: 'Non-Contact',
    clearance: 'Cleared',
    concussionHistory: false,
    redS: false,
    familyCardiovascular: false
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    athleteName: 'Taylor, James',
    age: 17,
    ageBand: 'Adolescent',
    sport: 'Basketball',
    position: 'Point Guard',
    contactLevel: 'Limited Contact',
    clearance: 'Cleared with Conditions',
    concussionHistory: false,
    redS: false,
    familyCardiovascular: true
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    athleteName: 'Davies, Helen',
    age: 28,
    ageBand: 'Adult',
    sport: 'Hockey',
    position: 'Forward',
    contactLevel: 'Contact',
    clearance: 'Not Cleared Pending Further Evaluation',
    concussionHistory: false,
    redS: false,
    familyCardiovascular: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    athleteName: 'Wilson, Robert',
    age: 32,
    ageBand: 'Adult',
    sport: 'Cricket',
    position: 'Fast Bowler',
    contactLevel: 'Limited Contact',
    clearance: 'Cleared',
    concussionHistory: false,
    redS: false,
    familyCardiovascular: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    athleteName: 'Evans, Catherine',
    age: 14,
    ageBand: 'Adolescent',
    sport: 'Athletics',
    position: 'Long-Distance Runner',
    contactLevel: 'Non-Contact',
    clearance: 'Not Cleared Pending Further Evaluation',
    concussionHistory: false,
    redS: true,
    familyCardiovascular: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    athleteName: 'Thomas, Michael',
    age: 52,
    ageBand: 'Masters',
    sport: 'Swimming',
    position: 'Masters Freestyle',
    contactLevel: 'Non-Contact',
    clearance: 'Cleared with Conditions',
    concussionHistory: false,
    redS: false,
    familyCardiovascular: true
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    athleteName: 'Robinson, Emma',
    age: 20,
    ageBand: 'Adult',
    sport: 'Rugby',
    position: 'Scrum-Half',
    contactLevel: 'Contact',
    clearance: 'Not Cleared for Sport',
    concussionHistory: true,
    redS: true,
    familyCardiovascular: false
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    athleteName: 'Clark, George',
    age: 9,
    ageBand: 'Youth',
    sport: 'Football',
    position: 'Goalkeeper',
    contactLevel: 'Contact',
    clearance: 'Cleared',
    concussionHistory: false,
    redS: false,
    familyCardiovascular: false
  }
];

export { sampleAthletes };
