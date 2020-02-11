import { Component, OnInit } from '@angular/core';
import { AgentService } from './agent.service';
import { AgentCollectionData} from './agent.model';
import { AgentStatusPipe } from '../pipes/agent-status.pipe';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {

  agents = [];

  constructor(private agentService: AgentService) { }

  ngOnInit(): void {
    this.agentService.getAgents().subscribe((data: AgentCollectionData) => {
      console.log(data.agents);
      this.agents = data.agents;
    });
  }

}
