import { CompetenceData } from '../competence-item/competence.model';

export class AgentData {
  constructor(public name: string, public status: string, public id?: number, public competences?: CompetenceData[]) {}
}

export class AgentCollectionData {
  agents: AgentData[];
}
