import {Input} from '@angular/core';
import {EventEmitter, Output} from '@angular/core';
import {Component, OnChanges, OnInit} from '@angular/core';
import {IPager} from '../../models/pager.model';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class Pager implements OnInit, OnChanges {
  @Output() changed: EventEmitter<number> = new EventEmitter<number>();
  @Input() model!: IPager;
  pageNumber: number[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.model) {
      this.model.items = (this.model.itemsPage > this.model.totalItems) ? this.model.totalItems : this.model.itemsPage;
      this.pageNumber = [];
      for (let i = 0; i < this.model.totalPages; i++) {
        this.pageNumber.push(i);
      }
    }
  }

  onPageClicked(page: number) {
    this.changed.emit(this.model.actualPage = page);
  }

  onNextClicked(event: any) {
    event.preventDefault();
    this.changed.emit(this.model.actualPage + 1);
  }

  onPreviousClicked(event: any) {
    event.preventDefault();
    this.changed.emit(this.model.actualPage - 1);
  }
}
