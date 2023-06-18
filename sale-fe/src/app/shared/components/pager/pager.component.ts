import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {IPager} from '../../models/pager.model';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class Pager implements OnInit, OnChanges {
  @Output() changed: EventEmitter<number> = new EventEmitter<number>();
  @Input() model: IPager;
  pageNumber: number[] = [];

  constructor() {
    this.model = {
      items: 0,
      totalItems: 0,
      totalPages: 0,
      actualPage: 0,
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.model) {
      this.model.items = (this.model.items > this.model.totalItems) ? this.model.totalItems : this.model.items;
      this.pageNumber = [];
      for (let i = 0; i < this.model.totalPages; i++) {
        this.pageNumber.push(i);
      }
    }
  }

  onPageClicked(page:number){
    this.changed.emit(this.model.actualPage = page);
  }

  onNextClicked(event: any){
    event.preventDefault();
    this.changed.emit(this.model.actualPage + 1);
  }

  onPreviousClicked(event: any){
    event.preventDefault();
    this.changed.emit(this.model.actualPage - 1);
  }
}
