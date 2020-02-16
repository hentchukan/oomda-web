export class AgentData {
  constructor(public name: string, public status: string, public id?: number) {}
}

export class AgentCollectionData {
  agents: AgentData[];
}
