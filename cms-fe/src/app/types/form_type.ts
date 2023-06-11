import {FormGroup, UntypedFormBuilder} from "@angular/forms";

interface Category {
  id: number,
  name: String
}

interface FormValue {
  value: any
}

class FormController {
  public formGroup: FormGroup


  constructor(public formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({value: null})
  }

  public updateValue(value: any) {
    this.formGroup.setValue({value: value})
  }

  public getValue(): any {
    return (this.formGroup.value as FormValue).value
  }

  public getValueStr(): String {
    return JSON.stringify(this.getValue(), null, 0)
  }
}

export {Category, FormController, FormValue}
