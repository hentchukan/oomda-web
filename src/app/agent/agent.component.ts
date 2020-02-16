import { Component, OnInit, OnChanges } from '@angular/core';
import { AgentService } from './agent.service';
import { AgentCollectionData, AgentData} from './agent.model';
import { AgentStatusPipe } from '../pipes/agent-status.pipe';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatFormField} from '@angular/material';
import { from } from 'rxjs';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {

  agents = [];
  statusList = ['A', 'N'];
  agentForm = new FormGroup ({
    name: new FormControl(),
    status: new FormControl(this.statusList[0]),
  });
  searchForm = new FormGroup(
    {key: new FormControl()}
  );

  update = true;

  constructor(private agentService: AgentService) { }

  ngOnInit(): void {
    this.getAll();
  }

  filter(): void {
    if (this.searchForm.value.key) {
      this.getOne();
    } else {
      this.getAll();
    }
  }

  save(): void {
    this.agentService.save(new AgentData(this.agentForm.value.name, this.agentForm.value.status), this.update).subscribe((data) => {
      this.reset();
      this.getAll();
    }
    );
  }

  getAll(): void {
    this.agentService.getAgents().subscribe((data: AgentCollectionData) => {
      console.log(data.agents);
      this.agents = data.agents;
    });
  }

  getOne() {
    this.agentService.getAgent(this.searchForm.value.key).subscribe( (agent) => {
      this.agents = [agent];
    });
  }

  delete(agent: AgentData) {
    this.agentService.deleteAgent(agent.name).subscribe(() => {
      console.log('Successfully deleted');
      this.getAll();
    });
  }

  details(agent: AgentData) {
    this.agentForm.setValue(agent);
    this.update = true;
  }

  reset() {
    this.agentForm = new FormGroup({
      name: new FormControl(),
      status: new FormControl(this.statusList[0])
    });
    this.update = false;
  }
}
