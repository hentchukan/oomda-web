import { Component, OnInit, OnChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AgentService } from './agent.service';
import { AgentCollectionData, AgentData} from './agent.model';
import { AgentStatusPipe } from '../pipes/agent-status.pipe';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import {MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatFormField,
  MatTableDataSource,
  MatPaginator,
  ErrorStateMatcher} from '@angular/material';
import { from } from 'rxjs';
import { CompetenceItemComponent } from '../competence-item/competence-item.component';
import { CompetenceData } from '../competence-item/competence.model';
import { TechnologyService } from '../technology/technology.service';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {

  statusList = ['A', 'N'];
  displayedColumns: string[] = ['Competence', 'Delete'];
  agentsColumns: string[] = ['Name', 'Status', 'Delete'];

  competences = new MatTableDataSource<CompetenceData>([]);
  agents = new MatTableDataSource<AgentData>([]);

  agentForm: FormGroup;

  searchForm = new FormGroup(
    {key: new FormControl()}
  );

  @ViewChild('agentPaginator') agentPaginator: MatPaginator;
  @ViewChild('skillPaginator') skillPaginator: MatPaginator;
  @ViewChild('competences') competencesTable: HTMLTableElement;

  constructor(private agentService: AgentService) { }

  ngOnInit(): void {
    this.getAll();
    this.reset();
  }

  filter(): void {
    if (this.searchForm.value.key) {
      this.getOne();
    } else {
      this.getAll();
    }
  }

  save(): void {
    if (this.totalValidator()) {
      return;
    }

    this.competences.data.forEach((c) => {
      c.agent = this.agentForm.value;
      c.agent.competences = null;
    });
    this.agentService.save(new AgentData(this.agentForm.controls.name.value,
        this.agentForm.controls.status.value, this.agentForm.controls.id.value, this.competences.data),
       this.agentForm.controls.name.disabled).subscribe((data) => {
         this.reset();
         this.getAll();
      });
  }

  getAll(): void {
    this.agentService.getAgents().subscribe((data: AgentCollectionData) => {
      console.log(data.agents);
      this.agents = new MatTableDataSource(data.agents);
      this.agents.paginator = this.agentPaginator;
    });
  }

  getOne() {
    this.agentService.findAgentByName(this.searchForm.value.key).subscribe( (agent) => {
      this.agents = new MatTableDataSource([agent]);
    });
  }

  delete(agent: AgentData) {
    this.agentService.deleteAgent(agent.id).subscribe(() => {
      console.log('Successfully deleted');
      this.getAll();
    });
  }

  deleteItem(skillIndex) {
    this.competences.data.splice(skillIndex, 1);
    this.competences._updateChangeSubscription();
  }

  details(agent: AgentData) {
    this.agentService.getAgent(agent.id).subscribe((detail) => {
      this.agentForm.setValue(detail);
      this.agentForm.controls.name.disable({onlySelf: true});
      this.updateCompetences(detail.competences);
    });
  }

  updateCompetences(competences: CompetenceData[]) {
    this.competences.data = competences;
    this.competences._updateChangeSubscription();
  }

  addSkill() {
    this.competences.data.push(this.initData());
    this.competences._updateChangeSubscription();
  }

  private initData(): CompetenceData {
    return new CompetenceData(null, null, 1, 'SNAPSHOT');
  }

  reset() {
    this.agentForm = new FormGroup ({
      name: new FormControl({value: '',  disabled: false}, [Validators.required, Validators.minLength(3)]),
      status: new FormControl(this.statusList[0]),
      competences: new FormControl(this.competences.data),
      id: new FormControl()
    });
    this.updateCompetences([]);
  }

  public totalValidator() {
      const competences = this.agentForm.controls.competences;
      if (this.competences.data.length > 0) {
        const distArray = Array.from(this.competences.data
          .reduce((m, t) => m.set(((t.technology) ? t.technology.name : null), t), new Map()).values());
        if (distArray.length < this.competences.data.length) {
          return true;
        } else if (this.competences.data.filter(c => !c.technology).length > 0) {
          console.log('zz');
          return true;
        }
      }
      return false;
  }
}
