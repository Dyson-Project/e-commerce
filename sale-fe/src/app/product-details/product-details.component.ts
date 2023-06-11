import {IProduct} from '../shared/models/product.model';
import {ConfigurationService} from '../shared/services/configuration.service';
import {SecurityService} from '../shared/services/security.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ISku} from '../shared/models/sku.model';
import {CartWrapperService} from '../shared/services/cart.wrapper.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import numberOnly from '../shared/util/validate';
import {ICartItem} from '../shared/models/cartItem.model';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {ProductService} from "../shared/services/product.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  authenticated: boolean;
  product!: IProduct;
  selectedSku!: ISku;
  selectedImageUrl!: string;
  quantity: number = 0;
  skuForm!: FormGroup;
  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    // "nextArrow": "<div class='nav-btn next-slide'></div>",
    // "prevArrow": "<div class='nav-btn prev-slide'></div>",
  //  dots: true,
    // infinite: false
  };
  constructor(
    private route: ActivatedRoute,
    // private service: ProductDetailService,
    private service: ProductService,
    private configurationService: ConfigurationService,
    private cartEventService: CartWrapperService,
    private formBuilder: FormBuilder,
    private sercurityService: SecurityService,
    private ngbCarouselConfig: NgbCarouselConfig) {

    this.authenticated = sercurityService.IsAuthorized;
    this.ngbCarouselConfig.interval = 5000;
    this.ngbCarouselConfig.wrap = true;
    this.ngbCarouselConfig.keyboard = false;
    this.ngbCarouselConfig.pauseOnHover = false;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const routeParams = this.route.snapshot.paramMap;
    const productId = Number(routeParams.get('productId'));
    this.loadProduct(productId);
  }

  loadSkuForm(): void {
    this.skuForm = this.formBuilder.group({
      byParams: new FormControl(`{"skuId":"${this.selectedSku.id
      }", "name":"${this.product.productName
      }", "variation":"${this.selectedSku.color + ' ' + this.selectedSku.size
      }", "itemPrice":"${this.selectedSku.price
      }", "quantity":"${this.quantity
      }", "image":"${this.selectedSku.images[0]}" }`)
    });
  }

  loadProduct(productId: number): void {
    this.service.getProduct(productId)
      .subscribe(product => {
        this.product = product;
        this.selectedSku = product.skus[0];
        this.selectedImageUrl = this.selectedSku.images[0];
        this.loadSkuForm();
      });
  }

  addToCart(event: any) {
    const cartItem: ICartItem = JSON.parse(this.skuForm.value.byParams);
    this.cartEventService.addItemToCart(cartItem);

  }

  onSkuChanged(event: any, value: ISku) {
    this.selectedSku = value;
  }

  onImageSelected(event:any, value: string){
    this.selectedImageUrl = value;
  }

  onQuantityChanged() {
    if(this.quantity > this.selectedSku.available){
      this.quantity = this.selectedSku.available;
      this.quantity = this.selectedSku.available;
    }
    this.loadSkuForm();
  }

  onQuantityChangedUp(){
    this.quantity +=1;
    this.onQuantityChanged();
  }

  onQuantityChangedDown() {
    this.quantity -=1;
    this.onQuantityChanged();
  }

  numberOnly(event: any){
    return numberOnly(event);
  }
}

// class Mag {
//   magnifierSize = 250;

//   magnification = 4;
//   public Mag() {
//     $('body').prepend('<div class="magnify"></div>');
//     this.magnifyImg('img', this.magnification, this.magnifierSize);

//   }
//   /*How many times magnification of image on page.*/

//   magnifyImg(ptr, magnification, magnifierSize) :void{
//     var $pointer;
//     if (typeof ptr == "string") {
//       $pointer = $(ptr);
//     } else if (typeof ptr == "object") {
//       $pointer = ptr;
//     }

//     if (!($pointer.is('img'))) {
//       alert('Object must be image.');
//       return;
//     }

//     magnification = +(magnification);

//     $pointer.hover(function () {
//       $(this).css('cursor', 'none');
//       $('.magnify').show();
//       //Setting some variables for later use
//       var width = $(this).width();
//       var height = $(this).height();
//       var src = $(this).attr('src');
//       var imagePos = $(this).offset();
//       var image = $(this);

//       if (magnifierSize == undefined) {
//         magnifierSize = '150px';
//       }

//       $('.magnify').css({
//         'background-size': width * magnification + 'px ' + height * magnification + "px",
//         'background-image': 'url("' + src + '")',
//         'width': magnifierSize,
//         'height': magnifierSize
//       });

//       //Setting a few more...
//       var magnifyOffset = +($('.magnify').width() / 2);
//       var rightSide = +(imagePos.left + $(this).width());
//       var bottomSide = +(imagePos.top + $(this).height());

//       $(document).mousemove(function (e) {
//         if (e.pageX < +(imagePos.left - magnifyOffset / 6) || e.pageX > +(rightSide + magnifyOffset / 6) || e.pageY < +(imagePos.top - magnifyOffset / 6) || e.pageY > +(bottomSide + magnifyOffset / 6)) {
//           $('.magnify').hide();
//           $(document).unbind('mousemove');
//         }
//         var backgroundPos = 0 - ((e.pageX - imagePos.left) * magnification - magnifyOffset) + "px " + -((e.pageY - imagePos.top) * magnification - magnifyOffset) + "px";
//         $('.magnify').css({
//           'left': e.pageX - magnifyOffset,
//           'top': e.pageY - magnifyOffset,
//           'background-position': backgroundPos
//         });
//       });
//     }, function () {

//     });
//   };

// }
