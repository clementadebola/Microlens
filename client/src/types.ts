export interface MicroorganismInfo {
  name: string;
  species: string;
  domain: string;
  diseases: string;
  transmission: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  prevention: string;
  habitat: string;
  morphology: string;
  size: string;
  elevation: string;
  shape: string;
  oxygenRequirement: string;
  growthTemperature: string;
  colonyCharacteristics: string;
  antibioticResistance: string;
  virulenceFactors: string;
  genomeSize: string;
  gcContent: string;
  replication: string;
  motility: string;
  biochemicalTests: string;
  environmentalResistance: string;
  publicHealthImpact: string;
  isolationSources: string;
  antibioticSensitivity: string;
}



export interface FormData {
  email: string;
  password: string;
}
export interface IScannedResult {
  id: string;
  prediction: string;
  image: string;
  timestamp: number;
  metaInfo: string;
  confidence: number;
}


export type QuestionDifficulty = "easy" | "medium" | "hard";
export type Field =
  | "physiology"
  | "anatomy"
  | "microbiology"
  | "pathology"
  | "hematology"
  | "histopathology"
  | "chemical pathology";

export interface Question {
  id: number;
  text: string;
  answers: string[];
  correctAnswer: string;
}

export interface QuizSettings {
  difficulty: QuestionDifficulty;
  numberOfQuestions: number;
  field: Field;
}
