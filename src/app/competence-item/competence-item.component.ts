import { Component, OnInit, Input } from '@angular/core';
import { CompetenceData } from './competence.model';
import { TechnologyService } from '../technology/technology.service';
import { TechnologyData } from '../technology/technology.model';
import { AgentData } from '../agent/agent.model';

@Component({
  selector: 'app-competence-item',
  templateUrl: './competence-item.component.html',
  styleUrls: ['./competence-item.component.css']
})
export class CompetenceItemComponent implements OnInit {

  @Input() competence = new CompetenceData(null, new TechnologyData(''), 1, 'SNAPSHOT');
  technologies: TechnologyData[];

  constructor(private technologyService: TechnologyService) { }

  ngOnInit(): void {
    this.technologyService.getTechnologies().subscribe((response) => {
      this.technologies = response.technologies;
    });
  }

  compareFn(c1: TechnologyData, c2: TechnologyData): boolean {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
  }
}
