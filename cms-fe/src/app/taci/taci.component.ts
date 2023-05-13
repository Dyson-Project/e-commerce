import { DataService } from '../shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-taci',
  templateUrl: './taci.component.html',
  styleUrls: ['./taci.component.scss']
})
export class TaciComponent implements OnInit {
  steps: Step[] = [];
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.solve();
  }

  solve() {
    this.dataService.get("http://localhost:8080")
    .pipe<Step[]>(tap((res:any)=>{return res}))
    .subscribe({
      next: res => {
        this.steps = res
        console.log(this.steps);
      }
    })
    // let stepForSave:Step = {
    //   newOpen: [],
    //   OPEN: `OPEN = { ${this.OPEN.map(item =>{ return `S${item.identity} `})} }`,
    //   CLOSED: `CLOSE = { ${ this.CLOSE.map(item =>{ return `S${item.identity} `})} }`,
    //   finishString: `Thêm ${newOpen.map(item => { return `S${item.identity} ` })} vào OPEN, thêm S${s.identity} vào CLOSED `,
    //   initString: `Lấy S${newOpen.identity} ra khỏi OPEN`
    // }
  }
}
interface Step {
  open: any;
  newOpens: any;
  close: any;
  v: any;
  initString: string;
  finishString: string;
  openToString: string,
  closeToString: string
}