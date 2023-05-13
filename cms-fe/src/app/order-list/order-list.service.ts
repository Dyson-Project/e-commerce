import { DataService } from '../shared/services/data.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { SecurityService } from '../shared/services/security.service';
import { ICatalog } from '../shared/models/catalog.model';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IOrder } from '../shared/models/order.model';
import { PDFDocument, StandardFonts, rgb, PDFPage, PDFPageDrawTextOptions } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { XhrFactory } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OrderListService {
  private orderUrl: string = '';

  constructor(
    private service: DataService,
    private configurationService: ConfigurationService,
    private SecurityService: SecurityService,
  ) {
    if(this.configurationService.isReady){
      this.orderUrl = this.configurationService.serverSettings.purchaseUrl + '/api/orders';
    } else {
      this.configurationService.settingLoaded$.subscribe(x=>{
        this.orderUrl = this.configurationService.serverSettings.purchaseUrl + '/api/orders';
      });
    }
  }

  getOrdersCatalog(params: {[param:string]:any}):Observable<ICatalog<IOrder>>{
    let url = this.orderUrl;
    if (params &&  Object.values(params).some(value=>value)) { 
      url += '?';
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          url += `${key}=${value}&`;
        }
      }
      url = url.substr(0, url.lastIndexOf('&'));
    }
    return this.service.get(url).pipe<ICatalog<IOrder>>(tap((response: any)=>{
      return response;
    }))
  }

  getOrder(orderId: number): Observable<IOrder> {
    const url = this.orderUrl + '/' + orderId;
    return this.service.get(url).pipe<IOrder>(map((res: any)=> {
      console.log(url, res);
      return res.data;
    }));
  }

  updateOrder(order: IOrder){
    let url = `${this.orderUrl}/${order.id}`;
    return this.service.put(url, order).pipe(tap((response:any)=>{
      return response;
    }))
  }

  async createOrderPDF(pdfDoc: PDFDocument, order: IOrder) {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize()
    
    const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontSize = 14
    const rootConfig:PDFPageDrawTextOptions = {
      x: 10,
      y: height - fontSize,
      size: fontSize,
      // font: fontRegular
    }
    page.drawText(`Order date ${order.createDate.substring(0, order.createDate.indexOf('T') > -1 ? order.createDate.indexOf('T') : order.createDate.length)}`, {
      ...rootConfig,
      y: rootConfig.y,
    });

    page.drawText(`Customer: ${order.customer.name}`, {
      ...rootConfig,
      y: rootConfig.y - fontSize*2,
    });

    page.drawText(`Phone Number: ${order.customer.phoneNumber}`, {
      ...rootConfig,
      y: rootConfig.y - fontSize*3,
    })

    const address = order.shippingAddress.replace(/[^a-z|^A-Z|^1-9|^\\ |,]/gm,'');
    page.drawText(`Shipping Address ${address}`, {
      ...rootConfig,
      y: rootConfig.y - fontSize*4,
    })

    // Table Order
    const xHeader = 10;
    const cellWidth = (width-20) / 5
    const cellHeight = fontSize + 6;
    const yHeader = rootConfig.y - fontSize*8;
    const cellTextConfig = { ...rootConfig, x: xHeader, y: yHeader - cellHeight / 1.2}

    page.drawLine({
      start: {x:10, y: yHeader},
      end: {x: width-10, y: yHeader}
    });
    page.drawText('Sku', cellTextConfig);
    page.drawText('Name', { ...cellTextConfig, x: xHeader + cellWidth });
    page.drawText('Quantity', { ...cellTextConfig, x: xHeader + cellWidth * 2 });
    page.drawText('Price', { ...cellTextConfig, x: xHeader + cellWidth * 3 });
    page.drawText('Amount', { ...cellTextConfig, x: xHeader + cellWidth * 4 });
    page.drawLine({
      start: { x: 10, y: yHeader - cellHeight },
      end: { x: width - 10, y: yHeader - cellHeight}
    });

    order.orderItems.forEach((item, index) => {
      const y = yHeader - cellHeight*(index+1);
      const cellConfig = {...rootConfig, y: y -cellHeight / 1.2};
      page.drawText(item.sku.sellerSku.substr(0, 14), {
        ...cellConfig, x: xHeader,
      });
      page.drawText(item.name.substr(0, 16), {
        ...cellConfig, x: xHeader + cellWidth
      });
      page.drawText(`${item.quantity}`, {
        ...cellConfig, x: xHeader + cellWidth *2
      });
      page.drawText(`${(item.price)}`, {
        ...cellConfig, x: xHeader + cellWidth * 3
      });
      page.drawText(`${(item.price*item.quantity)}`, {
        ...cellConfig, x: xHeader + cellWidth *4 
      });

      page.drawLine({
        start: { x: 10, y: y - cellHeight },
        end: { x: width - 10, y: y - cellHeight },
        opacity: 1,
      });
    });

    // General
    let totalPrice = 0;
    order.orderItems.forEach(item => {totalPrice += item.quantity*item.price})
    page.drawText(`Item Total Price:\t $${totalPrice}`, {
      ...rootConfig, y: fontSize*10, x: width - (200+totalPrice.toString().length)
    })
    page.drawText(`Shipping Fee:\t $${order.shippingFee}`,{
      ...rootConfig, y: fontSize*8, x: width - (200+totalPrice.toString().length)
    })
    page.drawText(`Total:\t $${order.totalPrice}`,{
      ...rootConfig, y: fontSize*6, x: width - (200+totalPrice.toString().length)
    })
  }

  async createPDF(orders: IOrder[]) {
    const pdfDoc = await PDFDocument.create()
    orders.forEach(order => {
      this.createOrderPDF(pdfDoc, order);
    });

    const pdfBytes = await pdfDoc.save();
    let fileData = [pdfBytes];
    var blob = new Blob(fileData, { type: 'application/pdf' });
    let url = window.URL.createObjectURL(blob);
    window.open(url);
  }
}