import type { BillOfSale, Classification } from '#lib/engine/types.js';
import { assessBillOfSale } from '#lib/engine/bill-of-sale-grader.js';

/** A sample bill of sale: an identifier and the full data the engine grades. */
export interface SampleBillOfSale {
  id: string;
  updatedAt: string;
  data: BillOfSale;
}

/** A row in the dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  registration: string;
  vehicle: string;
  sellerName: string;
  buyerName: string;
  classification: Classification;
  riskFlagCount: number;
  missingItemCount: number;
  flagCount: number;
  updatedAt: string;
}

/** The sample bills of sale, keyed by stable id (used to seed the wizard). */
export const sampleBillsOfSale: SampleBillOfSale[] = [
  {
    id: 'BOS-2026-0001',
    updatedAt: '2026-06-20',
    data: {
      sale: {
        saleDate: '2026-08-15',
        salePlace: "Seller's home, Leeds",
        sellerCapacity: 'private'
      },
      seller: {
        name: 'Hannah Whitfield',
        address: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        phone: '07700 900123',
        email: 'hannah.whitfield@example.com',
        isRegisteredKeeper: 'yes'
      },
      buyer: {
        name: 'Omar Siddiqui',
        address: '3 Park Row, Bradford',
        postcode: 'BD1 5HT',
        phone: '07700 900456',
        email: 'omar.siddiqui@example.com'
      },
      vehicle: {
        registration: 'LB68 KXR',
        make: 'Ford',
        model: 'Focus',
        colour: 'Blue',
        vin: 'WF0XXXGCDXJK12345',
        firstRegisteredYear: 2018,
        fuelType: 'petrol',
        mileage: 48210,
        mileageAccuracy: 'recorded'
      },
      checks: {
        v5cPresent: 'yes',
        v5cDetailsMatch: 'yes',
        motStatus: 'valid',
        motExpiryDate: '2027-03-02',
        financeStatus: 'none',
        financeCheckDate: '2026-08-10'
      },
      payment: {
        priceAsGbp: 6500,
        depositAsGbp: 500,
        paymentMethod: 'bank-transfer',
        paymentReceived: 'yes'
      },
      condition: {
        saleTerms: 'sold-as-seen',
        knownFaults: 'Small scratch on the rear bumper; passenger window is slow.',
        descriptionMatchesAdvert: 'yes'
      },
      dvla: {
        newKeeperSlipGiven: 'yes',
        dvlaNotification: 'online'
      },
      signatures: {
        sellerSigned: 'yes',
        buyerSigned: 'yes',
        signatureDate: '2026-08-15',
        note: ''
      }
    }
  },
  {
    id: 'BOS-2026-0002',
    updatedAt: '2026-06-21',
    data: {
      sale: {
        saleDate: '2026-08-15',
        salePlace: "Seller's home, Leeds",
        sellerCapacity: 'private'
      },
      seller: {
        name: 'Hannah Whitfield',
        address: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        phone: '07700 900123',
        email: 'hannah.whitfield@example.com',
        isRegisteredKeeper: 'yes'
      },
      buyer: {
        name: 'Omar Siddiqui',
        address: '3 Park Row, Bradford',
        postcode: 'BD1 5HT',
        phone: '07700 900456',
        email: 'omar.siddiqui@example.com'
      },
      vehicle: {
        registration: 'LB68 KXR',
        make: 'Ford',
        model: 'Focus',
        colour: 'Blue',
        vin: '',
        firstRegisteredYear: 2018,
        fuelType: 'petrol',
        mileage: null,
        mileageAccuracy: 'recorded'
      },
      checks: {
        v5cPresent: 'yes',
        v5cDetailsMatch: 'yes',
        motStatus: 'valid',
        motExpiryDate: '2027-03-02',
        financeStatus: 'none',
        financeCheckDate: '2026-08-10'
      },
      payment: {
        priceAsGbp: 6500,
        depositAsGbp: 500,
        paymentMethod: 'bank-transfer',
        paymentReceived: 'yes'
      },
      condition: {
        saleTerms: 'sold-as-seen',
        knownFaults: 'Small scratch on the rear bumper; passenger window is slow.',
        descriptionMatchesAdvert: 'yes'
      },
      dvla: {
        newKeeperSlipGiven: 'yes',
        dvlaNotification: 'online'
      },
      signatures: {
        sellerSigned: 'yes',
        buyerSigned: 'yes',
        signatureDate: '2026-08-15',
        note: ''
      }
    }
  },
  {
    id: 'BOS-2026-0003',
    updatedAt: '2026-06-22',
    data: {
      sale: {
        saleDate: '2026-08-15',
        salePlace: "Seller's home, Leeds",
        sellerCapacity: 'private'
      },
      seller: {
        name: 'Hannah Whitfield',
        address: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        phone: '07700 900123',
        email: 'hannah.whitfield@example.com',
        isRegisteredKeeper: 'yes'
      },
      buyer: {
        name: 'Omar Siddiqui',
        address: '3 Park Row, Bradford',
        postcode: 'BD1 5HT',
        phone: '07700 900456',
        email: 'omar.siddiqui@example.com'
      },
      vehicle: {
        registration: 'LB68 KXR',
        make: 'Ford',
        model: 'Focus',
        colour: 'Blue',
        vin: 'WF0XXXGCDXJK12345',
        firstRegisteredYear: 2018,
        fuelType: 'petrol',
        mileage: 48210,
        mileageAccuracy: 'recorded'
      },
      checks: {
        v5cPresent: 'yes',
        v5cDetailsMatch: 'yes',
        motStatus: 'valid',
        motExpiryDate: '2027-03-02',
        financeStatus: 'outstanding',
        financeCheckDate: '2026-08-10'
      },
      payment: {
        priceAsGbp: 6500,
        depositAsGbp: 500,
        paymentMethod: 'bank-transfer',
        paymentReceived: 'yes'
      },
      condition: {
        saleTerms: 'sold-as-seen',
        knownFaults: 'Small scratch on the rear bumper; passenger window is slow.',
        descriptionMatchesAdvert: 'yes'
      },
      dvla: {
        newKeeperSlipGiven: 'yes',
        dvlaNotification: 'online'
      },
      signatures: {
        sellerSigned: 'yes',
        buyerSigned: 'yes',
        signatureDate: '2026-08-15',
        note: ''
      }
    }
  },
  {
    id: 'BOS-2026-0004',
    updatedAt: '2026-06-23',
    data: {
      sale: {
        saleDate: '2026-08-15',
        salePlace: "Seller's home, Leeds",
        sellerCapacity: 'private'
      },
      seller: {
        name: 'Hannah Whitfield',
        address: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        phone: '07700 900123',
        email: 'hannah.whitfield@example.com',
        isRegisteredKeeper: 'no'
      },
      buyer: {
        name: 'Omar Siddiqui',
        address: '3 Park Row, Bradford',
        postcode: 'BD1 5HT',
        phone: '07700 900456',
        email: 'omar.siddiqui@example.com'
      },
      vehicle: {
        registration: 'LB68 KXR',
        make: 'Ford',
        model: 'Focus',
        colour: 'Blue',
        vin: 'WF0XXXGCDXJK12345',
        firstRegisteredYear: 2018,
        fuelType: 'petrol',
        mileage: 48210,
        mileageAccuracy: 'recorded'
      },
      checks: {
        v5cPresent: 'no',
        v5cDetailsMatch: 'yes',
        motStatus: 'valid',
        motExpiryDate: '2027-03-02',
        financeStatus: 'none',
        financeCheckDate: '2026-08-10'
      },
      payment: {
        priceAsGbp: 6500,
        depositAsGbp: 500,
        paymentMethod: 'bank-transfer',
        paymentReceived: 'yes'
      },
      condition: {
        saleTerms: 'sold-as-seen',
        knownFaults: 'Small scratch on the rear bumper; passenger window is slow.',
        descriptionMatchesAdvert: 'yes'
      },
      dvla: {
        newKeeperSlipGiven: 'no',
        dvlaNotification: 'online'
      },
      signatures: {
        sellerSigned: 'yes',
        buyerSigned: 'yes',
        signatureDate: '2026-08-15',
        note: ''
      }
    }
  },
  {
    id: 'BOS-2026-0005',
    updatedAt: '2026-06-24',
    data: {
      sale: {
        saleDate: '2026-08-15',
        salePlace: "Seller's home, Leeds",
        sellerCapacity: 'private'
      },
      seller: {
        name: 'Hannah Whitfield',
        address: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        phone: '07700 900123',
        email: 'hannah.whitfield@example.com',
        isRegisteredKeeper: 'yes'
      },
      buyer: {
        name: 'Omar Siddiqui',
        address: '3 Park Row, Bradford',
        postcode: 'BD1 5HT',
        phone: '07700 900456',
        email: 'omar.siddiqui@example.com'
      },
      vehicle: {
        registration: 'LB68 KXR',
        make: 'Ford',
        model: 'Focus',
        colour: 'Blue',
        vin: 'WF0XXXGCDXJK12345',
        firstRegisteredYear: 2018,
        fuelType: 'petrol',
        mileage: 48210,
        mileageAccuracy: 'recorded'
      },
      checks: {
        v5cPresent: 'yes',
        v5cDetailsMatch: 'yes',
        motStatus: 'valid',
        motExpiryDate: '2027-03-02',
        financeStatus: 'none',
        financeCheckDate: '2026-08-10'
      },
      payment: {
        priceAsGbp: 8000,
        depositAsGbp: 500,
        paymentMethod: 'cash',
        paymentReceived: 'yes'
      },
      condition: {
        saleTerms: 'sold-as-seen',
        knownFaults: 'Small scratch on the rear bumper; passenger window is slow.',
        descriptionMatchesAdvert: 'no'
      },
      dvla: {
        newKeeperSlipGiven: 'yes',
        dvlaNotification: 'online'
      },
      signatures: {
        sellerSigned: 'yes',
        buyerSigned: 'yes',
        signatureDate: '2026-08-15',
        note: ''
      }
    }
  },
  {
    id: 'BOS-2026-0006',
    updatedAt: '2026-06-25',
    data: {
      sale: {
        saleDate: '2026-08-15',
        salePlace: "Seller's home, Leeds",
        sellerCapacity: 'private'
      },
      seller: {
        name: 'Hannah Whitfield',
        address: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        phone: '07700 900123',
        email: 'hannah.whitfield@example.com',
        isRegisteredKeeper: 'yes'
      },
      buyer: {
        name: 'Omar Siddiqui',
        address: '3 Park Row, Bradford',
        postcode: 'BD1 5HT',
        phone: '07700 900456',
        email: 'omar.siddiqui@example.com'
      },
      vehicle: {
        registration: 'LB68 KXR',
        make: 'Ford',
        model: 'Focus',
        colour: 'Blue',
        vin: 'WF0XXXGCDXJK12345',
        firstRegisteredYear: 2018,
        fuelType: 'petrol',
        mileage: 48210,
        mileageAccuracy: 'recorded'
      },
      checks: {
        v5cPresent: 'yes',
        v5cDetailsMatch: 'yes',
        motStatus: 'valid',
        motExpiryDate: '2027-03-02',
        financeStatus: 'none',
        financeCheckDate: '2026-08-10'
      },
      payment: {
        priceAsGbp: 6500,
        depositAsGbp: 500,
        paymentMethod: 'bank-transfer',
        paymentReceived: 'yes'
      },
      condition: {
        saleTerms: 'sold-as-seen',
        knownFaults: 'Small scratch on the rear bumper; passenger window is slow.',
        descriptionMatchesAdvert: 'yes'
      },
      dvla: {
        newKeeperSlipGiven: 'yes',
        dvlaNotification: 'not-yet'
      },
      signatures: {
        sellerSigned: 'no',
        buyerSigned: '',
        signatureDate: null,
        note: ''
      }
    }
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleBillOfSaleRows: DashboardRow[] = sampleBillsOfSale.map((s) => {
  const r = assessBillOfSale(s.data);
  return {
    id: s.id,
    registration: s.data.vehicle.registration,
    vehicle: [s.data.vehicle.make, s.data.vehicle.model].filter(Boolean).join(' '),
    sellerName: s.data.seller.name,
    buyerName: s.data.buyer.name,
    classification: r.classification,
    riskFlagCount: r.riskFlagCount,
    missingItemCount: r.missingItemCount,
    flagCount: r.flaggedIssues.length,
    updatedAt: s.updatedAt
  };
});
