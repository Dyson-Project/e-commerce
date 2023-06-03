import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-model',
  templateUrl: './confirm-model.component.html',
  styleUrls: ['./confirm-model.component.scss']
})
export class ConfirmModelComponent implements OnInit {
  @Input() message: string;
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  onDimiss(){
    this.activeModal.dismiss();
  }

  onSubmit(){
    this.activeModal.close();
  }
  
}
