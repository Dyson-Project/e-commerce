import { DataService } from '../shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-ha-noi-tower',
  templateUrl: './ha-noi-tower.component.html',
  styleUrls: ['./ha-noi-tower.component.scss']
})
export class HaNoiTowerComponent implements OnInit {
  Open = [];
  Close = [];
  steps: Step[] = [];
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.solve();
  }

  solve() {
    this.dataService.get("http://localhost:8080/hanoi-tower")
      .pipe<Step[]>(tap((res: any) => { return res }))
      .subscribe({
        next: res => {
          this.steps = res
          console.log(this.steps[0].newOpens);
        }
      })
    }


  calcH(s: State): number {
    if (s.columns[0] != 3 && s.columns[1] == 3 && s.columns[2] == 3) {
      return 7;
    }
    if (s.columns[0] != 3 && s.columns[1] == 3 && s.columns[2] != 3) {
      return 6;
    }
    if (s.columns[0] != 3 && s.columns[1] != 3 && s.columns[2] == 3) {
      return 5;
    }
    if (s.columns[0] != 3 && s.columns[1] != 3 && s.columns[2] != 3) {
      return 4;
    }
    if (s.columns[0] == 3 && s.columns[1] != 3 && s.columns[2] == 3) {
      return 3;
    }
    if (s.columns[0] == 3 && s.columns[1] != 3 && s.columns[2] != 3) {
      return 2;
    }
    if (s.columns[0] == 3 && s.columns[1] == 3 && s.columns[2] !=3 ) {
      return 1;
    }
    if (s.columns[0] == 3 && s.columns[1] == 3 && s.columns[2] == 3) {
      return 0;
    }
    return -1;
  }

  findSameVertex(vertexs: IVertex[], state: State):IVertex {
    let vertex:IVertex = null;
    vertexs.forEach(v => {
      if (v.state.columns[0] == state.columns[0]
        && v.state.columns[1] == state.columns[1]
        && v.state.columns[2] == state.columns[2]) {
          vertex = v;
      }
    })
    return vertex;
  }

  resolve() {
    let done;
    let nO = 1;
    let identityCount = 0;
    this.Open.push({
      identity: identityCount,
      state: new State([1, 1, 1]),
      prevVertex: -1,
      g: 0,
      h: 4,
    })
    done = 0;
    let count = 20;
    while (done === 0 && count > 0) {
      count--;
      let smallesIndex;
      let smallest: IVertex = {
        identity: -1,
        state: null,
        prevVertex: -1,
        g: Number.MAX_SAFE_INTEGER,
        h: Number.MAX_SAFE_INTEGER,
      };
      this.Open.forEach((v, index) => {
        if (smallest.g + smallest.h > v.g + v.h) {
          smallest = v;
          smallesIndex = index;
        }
      })

      if (smallest.h === 0) {
        done = 3;
        break;
      }
      // if(smallest.g === Number.MAX_SAFE_INTEGER){
      //   done = 3;
      // }

      let tempVertex = this.Open.splice(smallesIndex, 1)[0];
      nO--;
      this.Close.push(tempVertex);

      // Gọi S1[0..k] là tập đỉnh sau O[t] không nằm trong O
      let S1: IVertex[] = [];
      tempVertex.state.changeState().forEach(state => {
        if (this.findSameVertex(this.Open, state) == null) {
          let vertext: IVertex = {
            identity: ++identityCount,
            state: state,
            prevVertex: smallesIndex,
            g: smallest.g + 1,
            h: this.calcH(state)
          }
          this.Open.push(vertext);
          S1.push(vertext);
        } else {
          let oldVertex = this.findSameVertex(this.Open, state);
          if((smallest.g+1+this.calcH(state)) < oldVertex.h+oldVertex.g){
          let vertext: IVertex = {
            identity: oldVertex.identity,
            state: state,
            prevVertex: smallesIndex,
            g: smallest.g + 1,
            h: this.calcH(state)
          }
          this.Open.push(vertext);
          S1.push(vertext);
          }
        }
      });

      //TODO: Remove state available in OPE
      //Snapshot
      // this.stepsSnapshot.push({
      //   OPEN: `OPEN = { ${this.Open.map(item => { return `S${item.identity} ` })} }`,
      //   CLOSED: `CLOSE = { ${this.Close.map(item => { return `S${item.identity} ` })} }`,
      //   finishString: `Thêm ${S1.map(item => { return `S${item.identity}, ` })} vào tập OPEN, thêm S${smallest.identity} vào CLOSED `,
      //   initString: `Lấy S${smallest.identity} ra khỏi OPEN`,
      //   s: [...S1]
      // })
      // console.log(this.stepsSnapshot[0].s[0].state.columns);
    }
  }
}

class State {
  columns:number[] = [1,1,1];

  constructor(state) {
    this.columns = state;
  }

  findStateForm(){
    if(this.columns[0] == this.columns[1] && this.columns[1] == this.columns[2]){
      return 1;
    }
    if(this.columns[0] != this.columns[1] && this.columns[1] != this.columns[2]){
      return 3;
    }
    return 2;
  }

  changeState():State[]{
    let newStates: State[] = [];
    switch (this.findStateForm()) {
      case 1:
      newStates.push(...this.moveDiskCase1());
        break;
      case 2:
      newStates.push(...this.moveDiskCase2());
        break;
      case 3:
      newStates.push(...this.moveDiskCase3()); 
        break;
    }
    return newStates;
  }

  moveDiskCase1():State[]{
    let newStates:State[] = [];
    switch (this.columns[2]) {
      case 1:
        newStates.push(new State([1,1,2]));
        newStates.push(new State([1,1,3]));
        break;
      case 2:
        newStates.push(new State([2,2,3]));
        newStates.push(new State([2,2,1]));
        break; 
      case 3:
        newStates.push(new State([3,3,1]));
        newStates.push(new State([3,3,2]));
        break;
    }
    return newStates;
  }
  
  moveDiskCase2():State[]{
    let newStates:State[] = [];
    switch(this.columns[2]){
      case 1:
        newStates.push(new State([this.columns[0], this.columns[1], 2]));
        newStates.push(new State([this.columns[0], this.columns[1], 3]));
        break;
      case 2:
        newStates.push(new State([this.columns[0], this.columns[1] , 1]));
        newStates.push(new State([this.columns[0], this.columns[1] , 3]));
        break;
      case 3:
        newStates.push(new State([this.columns[0], this.columns[1] , 1]));
        newStates.push(new State([this.columns[0], this.columns[1] , 2]));
        break;
    }
    if(this.columns[0] == this.columns[1]){
      let temp = 1;
      for (let i = 1; i <= 3; i++) {
        if (temp == this.columns[0] || temp == this.columns[2]) {
          temp++;
        }
      }
      newStates.push(new State([this.columns[0], temp ,this.columns[2]]))
    }
    if(this.columns[0]==this.columns[2]){
      let temp = 1;
      for(let i=1; i<=3; i++){
        if(temp == this.columns[0] || temp == this.columns[2]){
          temp++;
        }
      }
      newStates.push(new State([this.columns[0], temp ,this.columns[2]]))
    }
    if(this.columns[1]==this.columns[2]){
      let temp = 1;
      for(let i=1; i<=3; i++){
        if(temp == this.columns[0] || temp == this.columns[1]){
          temp++;
        }
      }
      newStates.push(new State([temp, this.columns[1], this.columns[2]]));
    }
    return newStates;
  }

  moveDiskCase3():State[]{
    let newStates:State[] = [];
    for(let i=1; i<=3; i++){
      if(this.columns[2]!=i){
        newStates.push(new State([this.columns[0], this.columns[1], i]));
      }
    }
    newStates.push(new State([this.columns[0], this.columns[0], this.columns[2]]));
    return newStates;
  }
}

interface IVertex {
  identity: number,
  state: State,
  prevVertex: number,
  g: number,
  h: number
}
interface Step {
  open: any;
  newOpens: any;
  close: any;
  v: any;
  initString: string;
  finishString: string;
  openToString: string;
  closeToString: string;
}
/*
Bước 1
Mở đỉnh đầu tiên S, gán g(S) = 0
Sử dụng tri thức bổ sung để ước tính hàm h(S)
Tính f(S) = g(S) + h(S)

Bước 2
Chọn đỉnh mở có f là nhỏ nhất và gọi đỉnh đó là N
Nếu N là đích:đường đi từ đỉnh ban đầu đến đỉnh N là ngắn nhất và bằng g(N). Dừng(Success)

Nếu không tồn tại đỉnh mở nào: cây biểu diễn vấn đề không tồn tại đường đi tới mục tiêu.Dừng (Fail).

Nếu có 2 đỉnh mở trở lên có cùng giá trị f nhỏ nhất: ta phải kiểm tra xem những đỉnh đó có đỉnh nào là đích hay không.
  Nếu có: Đường đi từ đỉnh ban đầu đến đỉnh N là ngắn nhất và bằng g(N). Dừng.
  Nếu không có: chọn ngẫu nhiên một trong các đỉnh đó và gọi đó là đỉnh N.

Bước 3
Đóng đỉnh N, mở mọi đỉnh sau N. Với mỗi đỉnh sau N, tính:
g(S) = g(N) + gt(S->N)
Sử dụng tri thức bổ sung để tính h(S).
f(S) = g(S) + h(S).

Bước 4: Quay lại Bước 2
  */

/*

bieu dien trang thai theo vi tri cua 3 disk
*/