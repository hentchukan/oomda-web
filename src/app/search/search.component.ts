import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatTable } from '@angular/material';
import { TechnologyData, TechnologyCollectionData } from '../technology/technology.model';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchService } from './search.service';
import { AgentData } from '../agent/agent.model';

import {MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatFormField,
  ErrorStateMatcher} from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  displayedColumns: string[] = ['Name'];
  dataSource = new MatTableDataSource<AgentData>();
  searchForm = new FormGroup({
    searchLine: new FormControl('')
  });
  searchKeys: string[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service: SearchService) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
    this.searchKeys = [];
  }

  search() {
    const technologies = new TechnologyCollectionData([]);
    this.searchKeys.forEach((k) => {
      technologies.technologies.push(new TechnologyData(k));
    });

    this.service.findByTechnologies(technologies).subscribe((data) => {
      this.dataSource.data = data.agents;
      this.dataSource._updateChangeSubscription();
    });
  }

  parse() {
    this.searchKeys = this.searchForm.value.searchLine.replace(/\s/g, '').split(',');
  }
}
