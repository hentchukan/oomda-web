import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatTable } from '@angular/material';
import { TechnologyService } from './technology.service';
import { TechnologyData } from './technology.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css']
})
export class TechnologyComponent implements OnInit {

  DELETE_FORBIDDEN = 'Cannot delete %name%, it\'s already used by some agents';
  DELETE_SUCCESSFUL = 'Technology %name% has been deleted';
  ADD_SUCCESSFUL = 'Technology %name% has been added to the list';
  color: boolean;
  message: string;

  displayedColumns: string[] = ['Name', 'Delete'];
  dataSource = new MatTableDataSource<TechnologyData>();
  searchForm = new FormGroup({
    filter: new FormControl()
  });

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service: TechnologyService) {
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
    this.getAll();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.message = null;
  }

  add() {
    this.service.save(new TechnologyData(this.searchForm.value.filter)).subscribe((data) => {
      this.getAll();
      this.showMessage('ADD', true, this.searchForm.value.filter);
    });
  }

  delete(item: TechnologyData) {
    this.service.deleteTechnology(item).subscribe(() => {
      this.getAll();
      this.showMessage('DELETE', true, item.name);
    }, (error: any) => {
      this.showMessage('DELETE', false, item.name);
    });
  }

  getAll() {
    this.service.getTechnologies().subscribe((data) => {
      this.dataSource = new MatTableDataSource<TechnologyData>(data.technologies);
      this.dataSource.paginator = this.paginator;
      this.searchForm.patchValue({filter: ''});
    });
  }

  showMessage(operation: string, color: boolean, tech: string) {
    this.color = color;
    if (operation === 'DELETE') {
      if (this.color) {
        this.message = this.DELETE_SUCCESSFUL.replace('%name%', tech);
      } else {
        this.message = this.DELETE_FORBIDDEN.replace('%name%', tech);
      }
    } else if (operation === 'ADD') {
      this.message = this.ADD_SUCCESSFUL.replace('%name%', tech);
    } else {
      this.message = null;
    }
  }
}
