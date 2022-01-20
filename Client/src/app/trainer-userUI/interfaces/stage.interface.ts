export interface Stage {
  _id: string,
  title: string,
  description: string,
  step: number,
  flow: string,
  type: string,
  externalId: string,
  externalName: string,
  percentage: number,
  module: {
    _id: string,
    name: string
  },
  assistant: string,
  active: boolean,
  createdAt: string,
  updatedAt: string,
  image_url: string,
  image_id: string  
}
  
  export interface StudyProgress {
    challenges: number,
    completedChallenges: number,
    percentage: number,
    study: TriviaStudy
  }

  export interface TriviaStudy {
    _id: string;
    name: string;
    description: string;
    domain: string;
    gm_code: string;
    cooldown: number;
    createdAt: string;
    updatedAt: string;
    image_id: string;
    image_url: string;
    max_per_interval: number;
  }