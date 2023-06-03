import { ProductService } from './product.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { ICategory } from '../shared/models/category.model';
import { IBrand } from '../shared/models/brand.model';
import { IProduct } from '../shared/models/product.model';
import { ISku } from '../shared/models/sku.model';
import { IImage } from '../shared/models/image.model';
import { AbstractControl, Validators } from '@angular/forms';
import { AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SecurityService } from '../shared/services/security.service';
import { EProductStatus } from '../shared/models/productStatus.const';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  param: any;
  productForm: ProductFormGroup;
  categories: ICategory[];
  brands: IBrand[];
  public Editor = ClassicEditor;
  constructor(
    private route: ActivatedRoute,
    private service: ProductService,
    private configurationService: ConfigurationService,
    private formBuilder: FormBuilder,
    private securityService: SecurityService
  ) {
    
  }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const productId = Number(routeParams.get('productId'));
    if(this.configurationService.isReady){
      this.loadData(productId);
    } else {
      this.configurationService.settingLoaded$.subscribe(x=>{
        this.loadData(productId);
      })
    }
  }

  loadData(productId){
    this.getBrands();
    this.getCategories();
    if (!productId) {
      this.loadNewProductForm();
    } else {
      this.loadProductForm(productId);
    }
  }

  getBrands(){
    this.service.getBrands().subscribe({
      next: brands=>{
        this.brands = brands;
      }
    })
  }

  getCategories(){
    this.service.getCategories().subscribe({
      next: categories=>{
        this.categories = categories;
      }
    })
  }

  loadNewProductForm(){
    this.productForm = new ProductFormGroup({
      id: new FormControl(null),
      productName: new FormControl(null, [Validators.required]),
      categoryId: new FormControl(0, []),
      brandId: new FormControl(0, []),
      description: new FormControl(null, []),
      sizes: new SizesFormArray(null, [], []),
      colors: new ColorFormArray(null, [], []),
      skus: new SkusFormArray(null, []),
      weight: new FormControl(0, []),
      length: new FormControl(0, []),
      width: new FormControl(0, []),
      height: new FormControl(0, []),
      status: new FormControl(true, [])
    })
  }

  loadProductForm(productId){
    let product: IProduct;
    this.service.getProduct(productId).subscribe({
      next: res => {
        console.log(res);
        product = res;
        console.log(product);
      },
      complete: () => {
        this.productForm = new ProductFormGroup({
          id: new FormControl(product.id, [Validators.required]),
          productName: new FormControl(product.productName, [Validators.required]),
          categoryId: new FormControl(product.categoryId, []),
          brandId: new FormControl(product.brandId, []),
          description: new FormControl(product.description, []),
          sizes: new SizesFormArray(product.skus,[],[]),
          colors: new ColorFormArray(product.skus, [],[]),
          skus: new SkusFormArray(product.skus, []),
          weight: new FormControl(product.skus[0].weight, []),
          length: new FormControl(product.skus[0].length, []),
          width: new FormControl(product.skus[0].width, []),
          height: new FormControl(product.skus[0].height, []),
          status: new FormControl(product.status==EProductStatus.Active, [])
        });
        console.log(this.productForm);
      }
    })
  }

  saveProduct() {
    let product = this.commitProductForm() as IProduct;
    console.log(product);
    console.log(this.productForm);
    if (!this.productForm.valid) {
      alert("check your inputs")
      return;
    }
    if (!product.id) {
      this.createNewProduct(product);
    } else {
      this.modifyProduct(product);
    }
  }

  createNewProduct(product: IProduct) {
    let newProductId: number;
    this.service.createProduct(product).subscribe({
      next: (res: IProduct) => { console.log('create product', res); newProductId = res.id },
      complete: () => {
        product.skus.forEach(sku => {
          sku.productId = newProductId;
          let skuId: number;
          this.service.createSku(sku).subscribe({
            next: (res: ISku) => { console.log('create sku', res); skuId = res.id },
            complete: () => {
              this.createImage(sku.images.map(img => {
                img.skuId = skuId;
                return img;
              }))
            }
          });
        })
      }
    });
  }

  modifyProduct(product: IProduct) {
    // update product
    let productId = product.id;
    this.service.modifyProduct(product).subscribe({ next: (res) => { console.log('modify product', res); } })
    // resolve sku
    product.skus.forEach(sku => {
      sku.productId = productId;
      this.deleteImageNotConstrain(sku.id, sku.images);
      let skuId: number;
      if (!sku.id) {
        this.service.createSku(sku).subscribe({
          next: (res: ISku) => { console.log('create sku', res); skuId = res.id },
          complete: () => {
            this.createImage(sku.images.map(img => {
              img.skuId = skuId;
              return img;
            }));
          }
        });
      } else {
        this.service.modifySku(sku).subscribe({
          next: (res: ISku) => { console.log('modify sku', res); skuId = sku.id },
          complete: () => {
            console.log('compltete run');
            this.createImage(sku.images.map(img => {
              img.skuId = skuId;
              return img;
            }));
          }
        });
      }
    })
    this.deleteSkuNotConstrain(product.id, product.skus);
  }

  createImage(images: IImage[]) {
    console.log('image for insert',images);
    // Resolve images
    images.forEach(image => {
      if (!image.id) {
        this.service.createImage(image).subscribe(res => console.log('create image', res));
      }
    })
  }

  deleteSkuNotConstrain(productId: number, currentSkus: ISku[]) {
    this.service.getProduct(productId).subscribe({
      next: (oldProduct) => {
        // Find sku
        let skusForDelete = oldProduct.skus.filter(oldSku => {
          return !currentSkus.some(sku => sku.id == oldSku.id);
        })
        skusForDelete.forEach(skusForDelete => {
          this.service.deleteSku(skusForDelete.id);
          // Delete sku's images
          skusForDelete.images.forEach(imgForDelete => {
            this.service.deleteImage(imgForDelete.id);
          })
        })
      }
    })
  }

  deleteImageNotConstrain(skuId: number, currentImages: IImage[]) {
    this.service.getSku(skuId).subscribe({
      next: oldSku => {
        // Find images
        let imagesForDelete = oldSku.images.filter(oldImage => {
          return !currentImages.some(image => image.id == oldImage.id);
        });
        // Delete image
        imagesForDelete.forEach(imageForDelete => {
          this.service.deleteImage(imageForDelete.id);
        })
      }
    })
  }

  commitProductForm(): IProduct {
    let skus = this.productForm.get('skus') as SkusFormArray;
    this.productForm.patchValue({skus: [...skus.controls.values()]});

    let product: IProduct = {
    productName : this.productForm.get("productName").value,
    brandId : this.productForm.brandIdValue,
    categoryId : this.productForm.categoryIdValue,
    description : this.productForm.get("description").value,
    sellerId : this.securityService.UserData.id,
    skus : this.productForm.get('skus').value,
    id: this.productForm.idValue,
    status: this.productForm.statusValue ? EProductStatus.Active : EProductStatus.Disabled
    };
    product.skus.forEach(sku=>{
      sku.weight = this.productForm.weightValue;
      sku.length = this.productForm.lengthValue;
      sku.width = this.productForm.widthValue
      sku.height = this.productForm.heightValue;
      sku.images = this.productForm.getImageValuesByColor(sku.color);
      sku.available = sku.quantity;
    })
    console.log(product);
    return product;
  }
}

class ProductFormGroup extends FormGroup {
  constructor(
    controls: { [key: string]: AbstractControl },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    console.log(this.skus);
    console.log(this.sizes);
  }

  newSize(): FormControl {
    return new FormControl('30', [Validators.required, Validators.min(0), Validators.pattern('\\d+')]);
  }

  addSize() {
    this.sizes.push(this.newSize());
    console.log(this.sizes);
  }

  removeSize(i: number) {
    this.sizes.removeAt(i);
  }

  newColor():FormGroup{
    return new FormGroup({
      color: new FormControl('color', Validators.required),
      images: new ImageFormArray([], [])
    });
  }

  addColor(){
    this.colors.push(this.newColor());
  }

  removeColor(i:number){
    this.colors.removeAt(i);
  }

  newSku():FormGroup{
    return new FormGroup({
      color: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('\\w+')]),
        size: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('\\d+')]),
        price: new FormControl(0, [Validators.required, Validators.min(1), Validators.pattern('\\d+')]),
        quantity: new FormControl(0, []),
        sellerSku: new FormControl('', [])
    });
  }

  addSku(){
    this.skus.push(this.newSku());
  }

  removeSku(i:number){
    this.skus.removeAt(i);
  }

  getImageValuesByColor(color: string): IImage[] {
    let images: IImage[] = [];
    let colorsFormArray = this.get("colors") as FormArray;
    for (let i = 0; i < colorsFormArray.controls.length; i++) {
      if (colorsFormArray.controls[i].get('color').value == color) {
        let imagesFormArray = colorsFormArray.controls[i].get('images') as FormArray;
        imagesFormArray.controls.forEach(imageFormGroup => {
          let imageObj = imageFormGroup.value;
          delete imageObj.file;
          images.push(imageObj);
        })        
      }
    }
    return images;
  }

  get productName(): FormControl {
    return this.get("productName") as FormControl;
  }

  get sizes(): FormArray {
    return this.get("sizes") as FormArray;
  }

  get colors(): FormArray {
    return this.get("colors") as FormArray;
  }

  get colorValues(): string[]{
    let colors = this.get("colors").value;
    colors =  colors.map(colorObj => {
      return colorObj.color;
    })
    return colors;
  }

  get skus(): FormArray {
    return this.get("skus") as FormArray;
  }

  get idValue(): number {
    return Number(this.get('id').value);
  }

  get brandIdValue(): number {
    return Number(this.get('brandId').value);
  }

  get categoryIdValue():number{
    return Number(this.get('categoryId').value);
  }

  get weightValue(): number {
    return Number(this.get('weight').value);
  }

  get heightValue(): number{
    return Number(this.get('height').value);
  }

  get lengthValue(): number{
    return Number(this.get('length').value);
  }

  get widthValue():number {
    return Number(this.get('width').value);
  }

  get statusValue():boolean{
    return this.get('status').value;
  }
}

class SizesFormArray extends FormArray {
  constructor(
    skus: ISku[],
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    controls.push(...this.generateFormControl(this.extractSizeFromSku(skus)));
  }

  extractSizeFromSku(skus: ISku[]): string[] {
    let sizes: string[] = [];
    if(skus != null)
    skus.forEach(sku => {
      if (!sizes.includes(String(sku.size))) {
        sizes.push(String(sku.size));
      }
    })
    return sizes;
  }

  generateFormControl(data: string[]): FormControl[] {
    console.log(data);
    let formControls: FormControl[] = [];
    data.forEach(item => {
      formControls.push(new FormControl(item, [Validators.required, Validators.min(0), Validators.pattern('\\d+')]));
    })
    return formControls;
  }
}

class ColorFormArray extends FormArray {
  constructor(
    skus: ISku[],
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    controls.push(...this.generateFormGroup(this.extractColorFromSku(skus)));
  }

  generateFormGroup(data: any[]): FormGroup[] {
    let formGroups: FormGroup[] = [];
    data.forEach(item => {
      formGroups.push(new FormGroup({
        color: new FormControl(item.color, [Validators.required]),
        images: new ImageFormArray(item.images, [])
      }, []));
    })
    return formGroups;
  }

  extractColorFromSku(skus: ISku[]) {
    let colors: {color:string, images: any[] }[] = [];
    if(skus!=null)
    skus.forEach(sku=>{
      let flag = true;
      colors.forEach(colorItem=>{
        if(colorItem.color == sku.color){
          flag = false;
        }
      })
      if(flag){
        colors.push({color: sku.color, images: sku.images });
      }
    })
    return colors;
  }

}

class ImageFormArray extends FormArray {
   constructor(
    images: IImage[],
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[],
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    controls.push(...this.generateFormControl(images));
  }

  generateFormControl(images: IImage[]): AbstractControl[] {
    let formGroups: FormGroup[] = [];
    console.log(images);
    images.forEach(imageObj => {
      formGroups.push(new FormGroup({
        id: new FormControl(imageObj.id),
        url: new FormControl(imageObj.url, [Validators.required]),
        file: new FormControl(null),
        skuId: new FormControl(imageObj.skuId)
      }))
    })
    return formGroups;
  }

  //Update image
  showPreview(event, index:number){
    const file = (event.target as HTMLInputElement).files[0];
    this.controls[index].patchValue({
      file: file
    })
    this.controls[index].get('file').updateValueAndValidity();

    //File preview
    const reader = new FileReader();
    reader.onload = () =>{
      this.controls[index]
        .patchValue({
          url: reader.result as string
        })
    }
    reader.readAsDataURL(file);
  }

  newImage():FormGroup{
    return new FormGroup({
       id: new FormControl(0),
       url: new FormControl(null),
       file: new FormControl(null),
       skuId: new FormControl(0)
    }, [])
  }

  addImage(){
    this.controls.push(this.newImage());
  }

  removeImage(i:number){
    this.controls.splice(i, 1);
  }
}

class SkusFormArray extends FormArray {
   constructor(
    skus: ISku[],
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    controls.push(...this.generateFormGroup(skus));
  }

  generateFormGroup(skus:ISku[]):FormGroup[]{
    let formGroups:FormGroup[] = [];
    if(skus != null)
    skus.forEach(sku=>{
      formGroups.push(new FormGroup({
        id: new FormControl(sku.id),
        color: new FormControl(sku.color, [Validators.required, Validators.pattern('\\w+')]),
        size: new FormControl(sku.size, [Validators.required, Validators.min(1), Validators.pattern('\\d+')]),
        price: new FormControl(sku.price, [Validators.required, Validators.min(1), Validators.pattern('\\d+')]),
        quantity: new FormControl(sku.quantity, [Validators.required, Validators.min(0), Validators.pattern('\\d+')]),
        sellerSku: new FormControl(sku.sellerSku, [])
      },[]));
    })
    return formGroups;
  }

}