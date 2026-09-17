/**
 * Emergency Symptom Detector
 * Scans user inputs and speech transcripts for high-risk red-flag keywords
 * that warrant immediate emergency medical intervention.
 */

export interface EmergencyCheckResult {
  isEmergency: boolean;
  matchedTerms: string[];
  recommendedAction: string;
  emergencyNumbers: { label: string; number: string }[];
}

const EMERGENCY_PATTERNS: { pattern: RegExp; term: string }[] = [
  // Respiratory Emergency
  {
    pattern:
      /\b(shortness of breath|cannot breathe|can't breathe|difficulty breathing|gasping|suffocating|choking|trouble breathing)\b/i,
    term: "Shortness of Breath / Breathing Difficulty",
  },

  // Cardiac / Severe Chest Symptoms
  {
    pattern:
      /\b(chest pain|chest pressure|crushing chest|heart attack|cardiac arrest|pain in left arm|tightness in chest|heart chest pain|chest discomfort|pain spreading)\b/i,
    term: "Chest Pain / Heart Attack Risk",
  },

  // Stroke / Neurological Emergency
  {
    pattern:
      /\b(sudden numbness|facial drooping|slurred speech|sudden weakness|loss of speech|stroke)\b/i,
    term: "Sudden Numbness / Stroke Symptoms",
  },

  // Bleeding / Trauma
  {
    pattern:
      /\b(severe bleeding|uncontrolled bleeding|coughing up blood|vomiting blood)\b/i,
    term: "Severe Bleeding",
  },

  // Consciousness / Seizures
  {
    pattern:
      /\b(fainted|fainting|passed out|loss of consciousness|unresponsive|seizure|convulsions)\b/i,
    term: "Loss of Consciousness / Seizure",
  },

  // Anaphylaxis / Allergic Reaction
  {
    pattern:
      /\b(throat swelling|anaphylaxis|severe allergic reaction|inability to swallow)\b/i,
    term: "Severe Allergic Reaction / Anaphylaxis",
  },

  // Severe Mental Health Crisis
  {
    pattern: /\b(suicidal|want to die|kill myself|end my life|self harm)\b/i,
    term: "Critical Crisis / Self-Harm Risk",
  },
];

// ── Mental Health Crisis Patterns ──
const MENTAL_HEALTH_CRISIS_PATTERNS: { pattern: RegExp; term: string }[] = [
  {
    pattern:
      /\b(suicidal|want to die|kill myself|end my life|end it all|better off dead)\b/i,
    term: "Suicidal Ideation",
  },
  {
    pattern:
      /\b(self harm|hurting myself|cutting myself|harming myself|hurt myself)\b/i,
    term: "Self-Harm Risk",
  },
  {
    pattern:
      /\b(feeling hopeless|no reason to live|worthless|nobody cares|no point in living|can't go on|give up on life)\b/i,
    term: "Emotional Distress / Crisis Risk",
  },
  {
    pattern:
      /\b(want to disappear|don't want to exist|wish i was dead|tired of living)\b/i,
    term: "Passive Suicidal Ideation",
  },
];

export interface MentalHealthCrisisResult {
  isCrisis: boolean;
  matchedTerms: string[];
  crisisResources: { label: string; contact: string; type: "call" | "text" }[];
}

export function checkMentalHealthCrisis(
  text: string,
): MentalHealthCrisisResult {
  if (!text || typeof text !== "string") {
    return {
      isCrisis: false,
      matchedTerms: [],
      crisisResources: [],
    };
  }

  const matchedTerms: string[] = [];

  for (const item of MENTAL_HEALTH_CRISIS_PATTERNS) {
    if (item.pattern.test(text)) {
      matchedTerms.push(item.term);
    }
  }

  const isCrisis = matchedTerms.length > 0;

  return {
    isCrisis,
    matchedTerms,
    crisisResources: [
      { label: "988 Suicide & Crisis Lifeline", contact: "988", type: "call" },
      { label: "iCall (India)", contact: "9152987821", type: "call" },
      {
        label: "Crisis Text Line",
        contact: "Text HOME to 741741",
        type: "text",
      },
    ],
  };
}

export function checkEmergencySymptoms(text: string): EmergencyCheckResult {
  if (!text || typeof text !== "string") {
    return {
      isEmergency: false,
      matchedTerms: [],
      recommendedAction: "",
      emergencyNumbers: [],
    };
  }

  const matchedTerms: string[] = [];

  for (const item of EMERGENCY_PATTERNS) {
    if (item.pattern.test(text)) {
      matchedTerms.push(item.term);
    }
  }

  const isEmergency = matchedTerms.length > 0;

  return {
    isEmergency,
    matchedTerms,
    recommendedAction: isEmergency
      ? "Seek immediate emergency medical attention or proceed to the nearest emergency department."
      : "",
    emergencyNumbers: [
      { label: "Emergency Hotline", number: "911" },
      { label: "Universal Emergency", number: "112" },
      { label: "Ambulance / Triage", number: "102" },
    ],
  };
}
