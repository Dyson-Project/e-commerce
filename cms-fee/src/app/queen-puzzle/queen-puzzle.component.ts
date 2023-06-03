import { DataService } from '../shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-queen-puzzle',
  templateUrl: './queen-puzzle.component.html',
  styleUrls: ['./queen-puzzle.component.scss']
})
export class QueenPuzzleComponent implements OnInit {
  steps: Step[] = [];
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.solve(100);
  }

  solve(step:number){
    this.dataService.get(`http://localhost:8080/queen?step=${step}`)
    .pipe<Step[]>(tap((res:any)=> res))
    .subscribe({
      next: res=>{
        this.steps = res;
        console.log(this.steps);
      }
    })
  }

}

interface Step{
  open: any,
  newOpens: any,
  close: any,
  v: any,
  initString: string;
  finishString: string;
  openToString: string;
  closeToString: string;
}