const ADVICE_MAP = {
  // Pillar 1: Foundation & Commitment
  P1_NO_LEADERSHIP_COMMITMENT: {
    text: "Your results indicate a lack of visible leadership commitment, which is the cornerstone of a psychologically safe workplace. Leadership buy-in is critical for securing resources and driving cultural change.",
    link: "https://www.safeworkaustralia.gov.au/safety-topic/managing-psychosocial-risks/model-code-practice-managing-psychosocial-hazards-work",
    type: 'weakness',
  },
  P1_NO_FORMAL_POLICY: {
    text: "Without a formal, documented policy, your approach to managing psychosocial risks may be inconsistent. A policy signals a formal commitment and provides clear guidance for everyone in the organisation.",
    link: "https://www.safeworkaustralia.gov.au/safety-topic/managing-psychosocial-risks/model-code-practice-managing-psychosocial-hazards-work",
    type: 'weakness',
  },
  P1_STRENGTH: {
    text: "Your organisation demonstrates a strong foundation with clear leadership commitment and documented policies. This is an excellent starting point for building a mature safety system.",
    type: 'strength',
  },
  // Pillar 2: Identification & Assessment
  P2_NO_IDENTIFICATION_PROCESS: {
    text: "You currently lack a formal process for identifying psychosocial hazards. Relying on informal methods can cause significant risks to be missed until an incident occurs.",
    link: "https://www.safeworkaustralia.gov.au/safety-topic/managing-psychosocial-risks/model-code-practice-managing-psychosocial-hazards-work",
    type: 'weakness',
  },
  P2_NO_CONSULTATION: {
    text: "Consultation with workers and their representatives (HSRs) is a legal requirement and a critical part of identifying risks. A management-led process will miss valuable on-the-ground insights.",
    link: "https://www.safeworkaustralia.gov.au/safety-topic/managing-psychosocial-risks/consultation",
    type: 'weakness',
  },
  P2_NO_RISK_ASSESSMENT: {
    text: "Identifying hazards is the first step, but without a formal risk assessment process, it's difficult to prioritise where to focus your efforts. Assessing the duration, frequency, and severity of exposure is key.",
    link: "https://www.safeworkaustralia.gov.au/safety-topic/managing-psychosocial-risks/model-code-practice-managing-psychosocial-hazards-work",
    type: 'weakness',
  },
  P2_STRENGTH: {
    text: "Your processes for identifying and assessing risks, including consultation, are robust. This proactive approach allows you to address issues before they escalate.",
    type: 'strength',
  },
  // Pillar 3: Control Measures
  P3_LACKS_JOB_DESIGN_CONTROLS: {
    text: "Your responses suggest gaps in control measures related to job design, such as managing workloads or ensuring role clarity. These are primary risk factors for stress and burnout.",
    link: "https://www.safeworkaustralia.gov.au/safety-topic/managing-psychosocial-risks/psychosocial-hazards/low-job-control",
    type: 'weakness',
  },
  P3_LACKS_BEHAVIOUR_CONTROLS: {
    text: "A lack of specific controls for harmful behaviours like bullying and harassment is a significant compliance and cultural risk. A zero-tolerance policy, training, and secure reporting are essential.",
    link: "https://www.safeworkaustralia.gov.au/safety-topic/managing-psychosocial-risks/psychosocial-hazards/workplace-bullying",
    type: 'weakness',
  },
  P3_LACKS_SUPPORT_SYSTEMS: {
    text: "While preventing harm is the priority, robust support systems like an EAP and manager training are crucial for helping workers who are experiencing psychological distress.",
    link: "https://www.safeworkaustralia.gov.au/safety-topic/managing-psychosocial-risks/model-code-practice-managing-psychosocial-hazards-work",
    type: 'weakness',
  },
  P3_STRENGTH: {
    text: "You have a good range of control measures in place, covering job design, workplace behaviours, and support systems. This demonstrates a multi-layered approach to worker wellbeing.",
    type: 'strength',
  },
  // Pillar 4: Review & Improvement
  P4_REACTIVE_REVIEW_PROCESS: {
    text: "Reviewing control measures only after an incident occurs is a reactive approach. Proactive, scheduled reviews are necessary to ensure your controls remain effective and to identify new risks.",
    link: "https://www.safeworkaustralia.gov.au/safety-topic/managing-psychosocial-risks/model-code-practice-managing-psychosocial-hazards-work",
    type: 'weakness',
  },
  P4_NO_SYSTEMIC_INVESTIGATION: {
    text: "Focusing incident investigations on individual conduct rather than systemic root causes means you are likely to miss opportunities to improve your overall safety system, and similar incidents may recur.",
    link: "https://www.safeworkaustralia.gov.au/safety-topic/managing-psychosocial-risks/model-code-practice-managing-psychosocial-hazards-work",
    type: 'weakness',
  },
  P4_STRENGTH: {
    text: "Your commitment to regular reviews and systemic investigations shows a high level of maturity in your WHS system. This focus on continuous improvement is best practice.",
    type: 'strength',
  },
}


export const useResultsLogic = (answers) => {

  const analysis = computed(() => {
    const userAnswers = answers.value
    const report = {
      pillar1: { title: 'Pillar 1: Foundation & Commitment', recommendations: [] },
      pillar2: { title: 'Pillar 2: Identification & Assessment', recommendations: [] },
      pillar3: { title: 'Pillar 3: Control Measures', recommendations: [] },
      pillar4: { title: 'Pillar 4: Review & Improvement', recommendations: [] },
    }

    // --- Pillar 1 Analysis ---
    if (userAnswers[1] === 'C' || userAnswers[1] === 'D') {
      report.pillar1.recommendations.push(ADVICE_MAP.P1_NO_LEADERSHIP_COMMITMENT)
    }
    if (userAnswers[2] === 'C' || userAnswers[2] === 'D') {
      report.pillar1.recommendations.push(ADVICE_MAP.P1_NO_FORMAL_POLICY)
    }
    if (report.pillar1.recommendations.length === 0) {
      report.pillar1.recommendations.push(ADVICE_MAP.P1_STRENGTH)
    }

    // --- Pillar 2 Analysis ---
    if (userAnswers[3]?.includes('E')) {
      report.pillar2.recommendations.push(ADVICE_MAP.P2_NO_IDENTIFICATION_PROCESS)
    }
    if (userAnswers[4] === 'C' || userAnswers[4] === 'D') {
      report.pillar2.recommendations.push(ADVICE_MAP.P2_NO_CONSULTATION)
    }
    if (userAnswers[5] === 'B' || userAnswers[5] === 'C' || userAnswers[5] === 'D') {
      report.pillar2.recommendations.push(ADVICE_MAP.P2_NO_RISK_ASSESSMENT)
    }
     if (report.pillar2.recommendations.length === 0) {
      report.pillar2.recommendations.push(ADVICE_MAP.P2_STRENGTH)
    }

    // --- Pillar 3 Analysis ---
    if (userAnswers[6]?.includes('E') || userAnswers[6]?.length < 2) {
        report.pillar3.recommendations.push(ADVICE_MAP.P3_LACKS_JOB_DESIGN_CONTROLS)
    }
    if (userAnswers[7]?.includes('E') || userAnswers[7]?.length < 2) {
        report.pillar3.recommendations.push(ADVICE_MAP.P3_LACKS_BEHAVIOUR_CONTROLS)
    }
     if (userAnswers[8]?.includes('E') || userAnswers[8]?.length < 2) {
        report.pillar3.recommendations.push(ADVICE_MAP.P3_LACKS_SUPPORT_SYSTEMS)
    }
    if (report.pillar3.recommendations.length === 0) {
      report.pillar3.recommendations.push(ADVICE_MAP.P3_STRENGTH)
    }

    // --- Pillar 4 Analysis ---
    if (userAnswers[9] === 'B' || userAnswers[9] === 'C') {
        report.pillar4.recommendations.push(ADVICE_MAP.P4_REACTIVE_REVIEW_PROCESS)
    }
    if (userAnswers[10] === 'B' || userAnswers[10] === 'C') {
        report.pillar4.recommendations.push(ADVICE_MAP.P4_NO_SYSTEMIC_INVESTIGATION)
    }
    if (report.pillar4.recommendations.length === 0) {
      report.pillar4.recommendations.push(ADVICE_MAP.P4_STRENGTH)
    }

    return Object.values(report)
  })

  return {
    analysis,
  }
}
