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
  timestamp: number;
  image?: string;
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
  timeInSeconds:number;
  language?: string;
}


export type Language = {
  code: string;
  name: string;
};

export const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'yo', name: 'Yorùbá' },
  { code: 'it', name: 'Italiano' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'ko', name: '한국어' },
];
