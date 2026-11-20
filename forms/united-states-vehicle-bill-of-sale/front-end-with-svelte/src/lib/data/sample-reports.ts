import type { BillOfSale, CompletenessClass } from '#lib/engine/types.js';
import { validateBillOfSale } from '#lib/engine/bill-of-sale-grader.js';

/** A sample bill of sale: an identifier and the full data the engine grades. */
export interface SampleBillOfSale {
  id: string;
  vehicle: string;
  sellerName: string;
  saleDate: string;
  data: BillOfSale;
}

/** A row in the dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  vin: string;
  vehicle: string;
  sellerName: string;
  completenessClass: CompletenessClass;
  leadIssue: string;
  odometerExempt: string;
  flagCount: number;
  saleDate: string;
}

// One sample per persona in `examples/personas.json`, so the dashboard's offline
// data and the persona oracle cannot disagree.
/** Sample bills of sale spanning all three completeness classes. */
export const sampleBillsOfSale: SampleBillOfSale[] = [
  {
    id: '1',
    vehicle: '2018 Toyota Corolla',
    sellerName: 'Dana R. Whitfield',
    saleDate: '2026-08-25',
    data: {
      transaction: {
        state: 'TX',
        saleDate: '2026-08-25',
        salePriceAsUsd: 12500,
        paymentMethod: 'check',
        taxBasis: 'standard-presumptive-value'
      },
      seller: {
        name: 'Dana R. Whitfield',
        type: 'individual',
        streetAddress: '412 Mesquite Lane',
        city: 'Austin',
        state: 'TX',
        postalCode: '78704',
        phone: '512-555-0142',
        signed: 'yes'
      },
      buyer: {
        name: 'Marcus T. Alvarez',
        type: 'individual',
        streetAddress: '88 Oak Hollow Dr',
        city: 'Round Rock',
        state: 'TX',
        postalCode: '78664',
        phone: '512-555-0187',
        signed: 'yes'
      },
      vehicle: {
        year: 2018,
        make: 'Toyota',
        model: 'Corolla',
        bodyType: 'Sedan',
        vin: '2T1BURHE5JC034461',
        color: 'Silver',
        titleNumber: 'TX55820193',
        titleBrand: 'clean',
        gvwrOver16000: 'no',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: 64210,
        status: 'actual',
        sellerCertified: 'yes',
        buyerAcknowledged: 'yes'
      },
      terms: {
        sellerHoldsTitle: 'yes',
        titleSigned: 'yes',
        lienStatus: 'none',
        lienholderName: '',
        lienReleaseDate: null,
        asIsClause: 'as-is',
        warrantyNote: '',
        notarized: 'not-required'
      },
      afterSale: {
        releaseOfLiabilityFiled: 'yes',
        releaseFiledDate: '2026-08-26',
        platesRemoved: 'yes',
        buyerTitleApplicationDate: '2026-08-30'
      }
    }
  },
  {
    id: '2',
    vehicle: '2005 Honda Accord',
    sellerName: 'Priya Nair',
    saleDate: '2026-08-01',
    data: {
      transaction: {
        state: 'CA',
        saleDate: '2026-08-01',
        salePriceAsUsd: 3200,
        paymentMethod: 'cash',
        taxBasis: 'purchase-price'
      },
      seller: {
        name: 'Priya Nair',
        type: 'individual',
        streetAddress: '2210 Alder St',
        city: 'Sacramento',
        state: 'CA',
        postalCode: '95816',
        phone: '916-555-0119',
        signed: 'yes'
      },
      buyer: {
        name: 'Tom Becker',
        type: 'individual',
        streetAddress: '75 Delta Way',
        city: 'Davis',
        state: 'CA',
        postalCode: '95616',
        phone: '530-555-0166',
        signed: 'yes'
      },
      vehicle: {
        year: 2005,
        make: 'Honda',
        model: 'Accord',
        bodyType: 'Sedan',
        vin: '1HGCM82633A004352',
        color: 'Blue',
        titleNumber: 'CA1190442',
        titleBrand: 'clean',
        gvwrOver16000: 'no',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: null,
        status: '',
        sellerCertified: '',
        buyerAcknowledged: ''
      },
      terms: {
        sellerHoldsTitle: 'yes',
        titleSigned: 'yes',
        lienStatus: 'none',
        lienholderName: '',
        lienReleaseDate: null,
        asIsClause: 'as-is',
        warrantyNote: '',
        notarized: 'not-required'
      },
      afterSale: {
        releaseOfLiabilityFiled: 'yes',
        releaseFiledDate: '2026-08-03',
        platesRemoved: 'no',
        buyerTitleApplicationDate: '2026-08-08'
      }
    }
  },
  {
    id: '3',
    vehicle: '2019 Subaru Outback',
    sellerName: 'Elena Kowalski',
    saleDate: '2026-09-01',
    data: {
      transaction: {
        state: 'WA',
        saleDate: '2026-09-01',
        salePriceAsUsd: 19000,
        paymentMethod: 'wire',
        taxBasis: 'purchase-price'
      },
      seller: {
        name: 'Elena Kowalski',
        type: 'individual',
        streetAddress: '930 Pine Ridge Rd',
        city: 'Spokane',
        state: 'WA',
        postalCode: '99201',
        phone: '509-555-0130',
        signed: 'yes'
      },
      buyer: {
        name: 'Jordan Pike',
        type: 'individual',
        streetAddress: '',
        city: 'Spokane',
        state: 'WA',
        postalCode: '',
        phone: '509-555-0171',
        signed: 'no'
      },
      vehicle: {
        year: 2019,
        make: 'Subaru',
        model: 'Outback',
        bodyType: 'Wagon',
        vin: '4S4BSANC7K3205517',
        color: 'Green',
        titleNumber: '',
        titleBrand: 'clean',
        gvwrOver16000: 'no',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: 41870,
        status: 'actual',
        sellerCertified: 'yes',
        buyerAcknowledged: 'no'
      },
      terms: {
        sellerHoldsTitle: 'yes',
        titleSigned: 'yes',
        lienStatus: 'none',
        lienholderName: '',
        lienReleaseDate: null,
        asIsClause: '',
        warrantyNote: '',
        notarized: ''
      },
      afterSale: {
        releaseOfLiabilityFiled: '',
        releaseFiledDate: null,
        platesRemoved: '',
        buyerTitleApplicationDate: null
      }
    }
  },
  {
    id: '4',
    vehicle: '2019 Chevrolet Silverado 1500',
    sellerName: 'Gary L. Thompson',
    saleDate: '2026-06-15',
    data: {
      transaction: {
        state: 'FL',
        saleDate: '2026-06-15',
        salePriceAsUsd: 27000,
        paymentMethod: 'check',
        taxBasis: 'purchase-price'
      },
      seller: {
        name: 'Gary L. Thompson',
        type: 'individual',
        streetAddress: '1501 Palmetto Ave',
        city: 'Tampa',
        state: 'FL',
        postalCode: '33602',
        phone: '813-555-0108',
        signed: 'yes'
      },
      buyer: {
        name: 'Rosa Delgado',
        type: 'individual',
        streetAddress: '340 Bayshore Blvd',
        city: 'Clearwater',
        state: 'FL',
        postalCode: '33755',
        phone: '727-555-0194',
        signed: 'yes'
      },
      vehicle: {
        year: 2019,
        make: 'Chevrolet',
        model: 'Silverado 1500',
        bodyType: 'Pickup',
        vin: '1GCUYDED4KZ123456',
        color: 'Black',
        titleNumber: 'FL88231045',
        titleBrand: 'clean',
        gvwrOver16000: 'no',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: 131500,
        status: 'not-actual',
        sellerCertified: 'yes',
        buyerAcknowledged: 'yes'
      },
      terms: {
        sellerHoldsTitle: 'yes',
        titleSigned: 'yes',
        lienStatus: 'none',
        lienholderName: '',
        lienReleaseDate: null,
        asIsClause: 'as-is',
        warrantyNote: '',
        notarized: 'not-required'
      },
      afterSale: {
        releaseOfLiabilityFiled: 'yes',
        releaseFiledDate: '2026-07-30',
        platesRemoved: 'yes',
        buyerTitleApplicationDate: '2026-07-20'
      }
    }
  },
  {
    id: '5',
    vehicle: '2013 Ford F-150',
    sellerName: 'Walter Hayes',
    saleDate: '2026-08-28',
    data: {
      transaction: {
        state: 'OH',
        saleDate: '2026-08-28',
        salePriceAsUsd: 14500,
        paymentMethod: 'cash',
        taxBasis: 'purchase-price'
      },
      seller: {
        name: 'Walter Hayes',
        type: 'individual',
        streetAddress: '77 Buckeye Ct',
        city: 'Columbus',
        state: 'OH',
        postalCode: '43215',
        phone: '614-555-0122',
        signed: 'yes'
      },
      buyer: {
        name: 'Naomi Fischer',
        type: 'individual',
        streetAddress: '19 Lakeview Dr',
        city: 'Dublin',
        state: 'OH',
        postalCode: '43017',
        phone: '614-555-0149',
        signed: 'yes'
      },
      vehicle: {
        year: 2013,
        make: 'Ford',
        model: 'F-150',
        bodyType: 'Pickup',
        vin: '1FTFW1ET5DFC10312',
        color: 'White',
        titleNumber: 'OH7720188',
        titleBrand: 'rebuilt',
        gvwrOver16000: 'no',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: 118004,
        status: 'actual',
        sellerCertified: 'yes',
        buyerAcknowledged: 'yes'
      },
      terms: {
        sellerHoldsTitle: 'yes',
        titleSigned: 'yes',
        lienStatus: 'outstanding',
        lienholderName: 'First Federal Credit Union',
        lienReleaseDate: null,
        asIsClause: 'as-is',
        warrantyNote: '',
        notarized: 'no'
      },
      afterSale: {
        releaseOfLiabilityFiled: '',
        releaseFiledDate: null,
        platesRemoved: '',
        buyerTitleApplicationDate: null
      }
    }
  },
  {
    id: '6',
    vehicle: '2021 Toyota Tacoma',
    sellerName: 'Ingrid Larsen',
    saleDate: '2026-08-10',
    data: {
      transaction: {
        state: 'MN',
        saleDate: '2026-08-10',
        salePriceAsUsd: 31000,
        paymentMethod: 'wire',
        taxBasis: 'purchase-price'
      },
      seller: {
        name: 'Ingrid Larsen',
        type: 'individual',
        streetAddress: '5 Birch Hollow',
        city: 'Minneapolis',
        state: 'MN',
        postalCode: '55401',
        phone: '612-555-0111',
        signed: 'yes'
      },
      buyer: {
        name: 'Sam Okafor',
        type: 'individual',
        streetAddress: '812 Summit Ave',
        city: 'St. Paul',
        state: 'MN',
        postalCode: '55102',
        phone: '651-555-0138',
        signed: 'yes'
      },
      vehicle: {
        year: 2021,
        make: 'Toyota',
        model: 'Tacoma',
        bodyType: 'Pickup',
        vin: '3TMCZ5AN2MM123456',
        color: 'Gray',
        titleNumber: 'MN4410032',
        titleBrand: 'unknown',
        gvwrOver16000: 'no',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: 22400,
        status: 'actual',
        sellerCertified: 'yes',
        buyerAcknowledged: 'yes'
      },
      terms: {
        sellerHoldsTitle: 'yes',
        titleSigned: 'yes',
        lienStatus: 'none',
        lienholderName: '',
        lienReleaseDate: null,
        asIsClause: 'as-is',
        warrantyNote: '',
        notarized: 'not-required'
      },
      afterSale: {
        releaseOfLiabilityFiled: 'yes',
        releaseFiledDate: '2026-08-11',
        platesRemoved: 'yes',
        buyerTitleApplicationDate: '2026-08-15'
      }
    }
  },
  {
    id: '7',
    vehicle: '2016 Honda Civic',
    sellerName: 'Frank Delaney',
    saleDate: '2026-07-10',
    data: {
      transaction: {
        state: 'PA',
        saleDate: '2026-07-10',
        salePriceAsUsd: 11200,
        paymentMethod: 'check',
        taxBasis: 'purchase-price'
      },
      seller: {
        name: 'Frank Delaney',
        type: 'individual',
        streetAddress: '61 Quaker Rd',
        city: 'Pittsburgh',
        state: 'PA',
        postalCode: '15213',
        phone: '412-555-0105',
        signed: 'yes'
      },
      buyer: {
        name: 'Alicia Brandt',
        type: 'individual',
        streetAddress: '204 Mill St',
        city: 'Erie',
        state: 'PA',
        postalCode: '16501',
        phone: '814-555-0152',
        signed: 'yes'
      },
      vehicle: {
        year: 2016,
        make: 'Honda',
        model: 'Civic',
        bodyType: 'Sedan',
        vin: '19XFC2F57GE123456',
        color: 'Red',
        titleNumber: 'PA33901877',
        titleBrand: 'clean',
        gvwrOver16000: 'no',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: 87650,
        status: 'actual',
        sellerCertified: 'yes',
        buyerAcknowledged: 'yes'
      },
      terms: {
        sellerHoldsTitle: 'yes',
        titleSigned: 'yes',
        lienStatus: 'released',
        lienholderName: 'Keystone Auto Finance',
        lienReleaseDate: '2026-07-02',
        asIsClause: 'as-is',
        warrantyNote: '',
        notarized: 'yes'
      },
      afterSale: {
        releaseOfLiabilityFiled: 'no',
        releaseFiledDate: null,
        platesRemoved: 'yes',
        buyerTitleApplicationDate: null
      }
    }
  },
  {
    id: '8',
    vehicle: '2016 Jeep Cherokee',
    sellerName: 'Beth Carmichael',
    saleDate: '2026-12-01',
    data: {
      transaction: {
        state: 'IL',
        saleDate: '2026-12-01',
        salePriceAsUsd: 0,
        paymentMethod: 'gift',
        taxBasis: ''
      },
      seller: {
        name: 'Beth Carmichael',
        type: 'individual',
        streetAddress: '9 Prairie View',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        phone: '217-555-0173',
        signed: 'yes'
      },
      buyer: {
        name: 'Noah Carmichael',
        type: 'individual',
        streetAddress: '9 Prairie View',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        phone: '',
        signed: 'no'
      },
      vehicle: {
        year: 2016,
        make: 'Jeep',
        model: 'Cherokee',
        bodyType: 'SUV',
        vin: '1C4PJLCB8',
        color: 'Gray',
        titleNumber: '',
        titleBrand: 'clean',
        gvwrOver16000: 'no',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: 92000,
        status: 'actual',
        sellerCertified: 'yes',
        buyerAcknowledged: 'no'
      },
      terms: {
        sellerHoldsTitle: 'no',
        titleSigned: 'no',
        lienStatus: 'none',
        lienholderName: '',
        lienReleaseDate: null,
        asIsClause: 'as-is',
        warrantyNote: '',
        notarized: ''
      },
      afterSale: {
        releaseOfLiabilityFiled: '',
        releaseFiledDate: null,
        platesRemoved: '',
        buyerTitleApplicationDate: null
      }
    }
  },
  {
    id: '9',
    vehicle: '2012 Nissan Altima',
    sellerName: 'Helen Cho',
    saleDate: '2026-08-18',
    data: {
      transaction: {
        state: 'NY',
        saleDate: '2026-08-18',
        salePriceAsUsd: 5900,
        paymentMethod: 'cash',
        taxBasis: 'purchase-price'
      },
      seller: {
        name: 'Helen Cho',
        type: 'individual',
        streetAddress: '48 Willow Pl',
        city: 'Albany',
        state: 'NY',
        postalCode: '12207',
        phone: '518-555-0126',
        signed: 'yes'
      },
      buyer: {
        name: 'Victor Ramos',
        type: 'individual',
        streetAddress: '300 Hudson Ave',
        city: 'Troy',
        state: 'NY',
        postalCode: '12180',
        phone: '518-555-0183',
        signed: 'yes'
      },
      vehicle: {
        year: 2012,
        make: 'Nissan',
        model: 'Altima',
        bodyType: 'Sedan',
        vin: '1N4AL2AP9CN123456',
        color: 'Silver',
        titleNumber: 'NY91820334',
        titleBrand: 'clean',
        gvwrOver16000: 'no',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: 134120,
        status: 'actual',
        sellerCertified: 'yes',
        buyerAcknowledged: 'yes'
      },
      terms: {
        sellerHoldsTitle: 'yes',
        titleSigned: 'yes',
        lienStatus: 'none',
        lienholderName: '',
        lienReleaseDate: null,
        asIsClause: 'as-is',
        warrantyNote: '',
        notarized: 'not-required'
      },
      afterSale: {
        releaseOfLiabilityFiled: 'yes',
        releaseFiledDate: null,
        platesRemoved: 'yes',
        buyerTitleApplicationDate: '2026-08-25'
      }
    }
  },
  {
    id: '10',
    vehicle: '2020 Ford Transit 150',
    sellerName: 'Carla Mendes',
    saleDate: '2026-08-20',
    data: {
      transaction: {
        state: 'CA',
        saleDate: '2026-08-20',
        salePriceAsUsd: 22000,
        paymentMethod: 'wire',
        taxBasis: 'purchase-price'
      },
      seller: {
        name: 'Carla Mendes',
        type: 'individual',
        streetAddress: '14 Harbor Rd',
        city: 'Oakland',
        state: 'CA',
        postalCode: '94607',
        phone: '510-555-0101',
        signed: 'yes'
      },
      buyer: {
        name: 'Dev Patel',
        type: 'individual',
        streetAddress: '600 Market St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        phone: '415-555-0102',
        signed: 'yes'
      },
      vehicle: {
        year: 2020,
        make: 'Ford',
        model: 'Transit 150',
        bodyType: 'Van',
        vin: '1FTYE1CM2LKA12345',
        color: 'Silver',
        titleNumber: 'CA2203318',
        titleBrand: 'clean',
        gvwrOver16000: 'no',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: 58300,
        status: 'actual',
        sellerCertified: 'yes',
        buyerAcknowledged: 'yes'
      },
      terms: {
        sellerHoldsTitle: 'yes',
        titleSigned: 'no',
        lienStatus: 'none',
        lienholderName: '',
        lienReleaseDate: null,
        asIsClause: 'as-is',
        warrantyNote: '',
        notarized: 'not-required'
      },
      afterSale: {
        releaseOfLiabilityFiled: 'no',
        releaseFiledDate: null,
        platesRemoved: 'yes',
        buyerTitleApplicationDate: null
      }
    }
  },
  {
    id: '11',
    vehicle: '2017 Freightliner M2 106',
    sellerName: 'Lone Star Haulage LLC',
    saleDate: '2026-07-01',
    data: {
      transaction: {
        state: 'TX',
        saleDate: '2026-07-01',
        salePriceAsUsd: 46000,
        paymentMethod: 'check',
        taxBasis: 'purchase-price'
      },
      seller: {
        name: 'Lone Star Haulage LLC',
        type: 'business',
        streetAddress: '2200 Industrial Pkwy',
        city: 'Houston',
        state: 'TX',
        postalCode: '77032',
        phone: '713-555-0150',
        signed: 'yes'
      },
      buyer: {
        name: 'Pecos Freight Co',
        type: 'business',
        streetAddress: '55 Depot Rd',
        city: 'Midland',
        state: 'TX',
        postalCode: '79701',
        phone: '432-555-0161',
        signed: 'yes'
      },
      vehicle: {
        year: 2017,
        make: 'Freightliner',
        model: 'M2 106',
        bodyType: 'Box truck',
        vin: '1FVACWDT2HHJA1234',
        color: 'Silver',
        titleNumber: 'TX77120045',
        titleBrand: 'clean',
        gvwrOver16000: 'yes',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: null,
        status: '',
        sellerCertified: '',
        buyerAcknowledged: ''
      },
      terms: {
        sellerHoldsTitle: 'yes',
        titleSigned: 'yes',
        lienStatus: 'none',
        lienholderName: '',
        lienReleaseDate: null,
        asIsClause: 'as-is',
        warrantyNote: '',
        notarized: 'not-required'
      },
      afterSale: {
        releaseOfLiabilityFiled: 'yes',
        releaseFiledDate: '2026-07-05',
        platesRemoved: 'yes',
        buyerTitleApplicationDate: '2026-07-15'
      }
    }
  },
  {
    id: '12',
    vehicle: '2014 Dodge Ram 1500',
    sellerName: 'Rene Boudreaux',
    saleDate: '2026-08-05',
    data: {
      transaction: {
        state: 'LA',
        saleDate: '2026-08-05',
        salePriceAsUsd: 9800,
        paymentMethod: 'cash',
        taxBasis: 'purchase-price'
      },
      seller: {
        name: 'Rene Boudreaux',
        type: 'individual',
        streetAddress: '8 Bayou Ln',
        city: 'Lafayette',
        state: 'LA',
        postalCode: '70501',
        phone: '337-555-0120',
        signed: 'yes'
      },
      buyer: {
        name: 'Tasha Landry',
        type: 'individual',
        streetAddress: '91 Cane St',
        city: 'Baton Rouge',
        state: 'LA',
        postalCode: '70802',
        phone: '225-555-0121',
        signed: 'yes'
      },
      vehicle: {
        year: 2014,
        make: 'Dodge',
        model: 'Ram 1500',
        bodyType: 'Pickup',
        vin: '1C6RR6FT3ES123456',
        color: 'Silver',
        titleNumber: 'LA5530911',
        titleBrand: 'clean',
        gvwrOver16000: 'no',
        selfPropelled: 'yes'
      },
      odometer: {
        readingMiles: 999999,
        status: 'exceeds-mechanical-limits',
        sellerCertified: 'yes',
        buyerAcknowledged: 'yes'
      },
      terms: {
        sellerHoldsTitle: 'yes',
        titleSigned: 'yes',
        lienStatus: 'none',
        lienholderName: '',
        lienReleaseDate: null,
        asIsClause: 'warranty',
        warrantyNote: '30-day powertrain warranty from the seller.',
        notarized: 'yes'
      },
      afterSale: {
        releaseOfLiabilityFiled: '',
        releaseFiledDate: null,
        platesRemoved: 'yes',
        buyerTitleApplicationDate: null
      }
    }
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleBillOfSaleRows: DashboardRow[] = sampleBillsOfSale.map((s) => {
  const result = validateBillOfSale(s.data);
  const lead = result.flaggedIssues.find((f) => f.category !== 'disclaimer');
  return {
    id: s.id,
    vin: s.data.vehicle.vin,
    vehicle: s.vehicle,
    sellerName: s.sellerName,
    completenessClass: result.completenessClass,
    leadIssue: lead ? lead.category : '',
    odometerExempt: result.odometerExempt ? 'Exempt' : 'Required',
    flagCount: result.flaggedIssues.length,
    saleDate: s.saleDate
  };
});
