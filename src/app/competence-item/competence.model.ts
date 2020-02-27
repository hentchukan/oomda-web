import {TechnologyData} from '../technology/technology.model';
import {AgentData} from '../agent/agent.model';

export class CompetenceData {
    constructor(public agent?: AgentData, public technology?: TechnologyData, public level?: number, public version?: string) {}
}
