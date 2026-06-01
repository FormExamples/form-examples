(function (root) {
  const ns = (root.MedicalWaitingListCard = root.MedicalWaitingListCard || {});

  ns.calculateWaitingTimeStatus = function calculateWaitingTimeStatus(card, options) {
    const today = (options && options.todayIso) || ns.todayIso();
    const wt = ns.calculateWaitingTime(card, today);
    const additionalFlags = ns.detectAdditionalFlags(card, today);
    const daysToAppointment = ns.daysBetween(today, card.appointment.appointmentDate);

    return {
      waitingTimeStatus: wt.band,
      clinicalPriority: card.waitingList.clinicalPriority,
      targetWaitWeeks: wt.targetWaitWeeks,
      daysWaited: wt.daysWaited,
      weeksWaited: wt.weeksWaited,
      daysToTarget: wt.daysToTarget,
      daysToBreach: wt.daysToBreach,
      daysToAppointment: daysToAppointment,
      firedRules: wt.firedRules,
      additionalFlags: additionalFlags,
      graderNotes: ''
    };
  };
})(window);
