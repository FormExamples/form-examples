/* UK LPA Dashboard — sample fixtures.
 * Eight LPAs at various stages of the lifecycle, covering each
 * validity band and risk level for realistic dashboard demos.
 */
(function () {
  'use strict';

  window.LpaDashboardSampleData = [
    {
      id: '8f0d2c10-22a6-4f8b-9d50-9a3a1f8b7001',
      donorName: 'Margaret Whitfield',
      attorneyCount: 2,
      decisionMode: 'jointly_and_severally',
      whenAttorneysCanAct: 'as_soon_as_registered',
      replacementCount: 1,
      peopleToNotifyCount: 2,
      validityBand: 'ready_for_registration',
      compositeRisk: 'low',
      opgStatus: 'ready_for_registration',
      hasContinuationSheet1: false,
      reducedFeeRequested: false,
      createdAt: '2026-02-01T09:12:00Z'
    },
    {
      id: '7c12dba0-9b2c-4f5d-8a64-8f9e84b21002',
      donorName: 'Arthur Pennington',
      attorneyCount: 1,
      decisionMode: 'single_attorney',
      whenAttorneysCanAct: 'as_soon_as_registered',
      replacementCount: 0,
      peopleToNotifyCount: 0,
      validityBand: 'ready_for_signing',
      compositeRisk: 'moderate',
      opgStatus: 'draft',
      hasContinuationSheet1: false,
      reducedFeeRequested: false,
      createdAt: '2026-02-04T14:32:00Z'
    },
    {
      id: '2a4b8f60-7c3d-4e92-bf18-44a02cd23003',
      donorName: 'Beatrice Okonkwo',
      attorneyCount: 3,
      decisionMode: 'jointly',
      whenAttorneysCanAct: 'as_soon_as_registered',
      replacementCount: 0,
      peopleToNotifyCount: 1,
      validityBand: 'draft',
      compositeRisk: 'critical',
      opgStatus: 'draft',
      hasContinuationSheet1: false,
      reducedFeeRequested: false,
      createdAt: '2026-02-06T10:45:00Z'
    },
    {
      id: '5d8e7a30-4b6f-4791-9c52-19b8ef9c4004',
      donorName: 'Clive Davenport',
      attorneyCount: 5,
      decisionMode: 'jointly_and_severally',
      whenAttorneysCanAct: 'as_soon_as_registered',
      replacementCount: 2,
      peopleToNotifyCount: 3,
      validityBand: 'partially_signed',
      compositeRisk: 'high',
      opgStatus: 'partially_signed',
      hasContinuationSheet1: false,
      reducedFeeRequested: false,
      createdAt: '2026-02-08T16:20:00Z'
    },
    {
      id: '90e1b250-3c7a-4d28-a431-7b3f9e1d5005',
      donorName: 'Dorothy Kowalski',
      attorneyCount: 2,
      decisionMode: 'mixed',
      whenAttorneysCanAct: 'only_when_no_capacity',
      replacementCount: 1,
      peopleToNotifyCount: 4,
      validityBand: 'fully_signed',
      compositeRisk: 'moderate',
      opgStatus: 'fully_signed',
      hasContinuationSheet1: false,
      reducedFeeRequested: true,
      createdAt: '2026-02-10T08:05:00Z'
    },
    {
      id: '63a4f190-8e21-4f87-bcd6-2c41a7df6006',
      donorName: 'Edward Harrington',
      attorneyCount: 4,
      decisionMode: 'jointly_and_severally',
      whenAttorneysCanAct: 'as_soon_as_registered',
      replacementCount: 1,
      peopleToNotifyCount: 2,
      validityBand: 'submitted',
      compositeRisk: 'low',
      opgStatus: 'submitted',
      hasContinuationSheet1: false,
      reducedFeeRequested: false,
      createdAt: '2026-01-22T11:30:00Z'
    },
    {
      id: '4f7c2d80-5b1a-4d56-a9e0-3f4e1b9c7007',
      donorName: 'Fiona Macdonald',
      attorneyCount: 2,
      decisionMode: 'jointly_and_severally',
      whenAttorneysCanAct: 'as_soon_as_registered',
      replacementCount: 1,
      peopleToNotifyCount: 2,
      validityBand: 'registered',
      compositeRisk: 'low',
      opgStatus: 'registered',
      hasContinuationSheet1: false,
      reducedFeeRequested: false,
      createdAt: '2025-11-15T13:00:00Z'
    },
    {
      id: '1b9e8f00-2a3b-4c4d-b5e6-7c8a9b0c8008',
      donorName: 'Geraldine Patel',
      attorneyCount: 2,
      decisionMode: 'jointly',
      whenAttorneysCanAct: 'as_soon_as_registered',
      replacementCount: 0,
      peopleToNotifyCount: 0,
      validityBand: 'rejected',
      compositeRisk: 'critical',
      opgStatus: 'rejected',
      hasContinuationSheet1: false,
      reducedFeeRequested: false,
      createdAt: '2025-12-03T09:50:00Z'
    }
  ];
})();
