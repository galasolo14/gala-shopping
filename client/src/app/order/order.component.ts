import { Component, OnInit, Input } from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import axios from 'axios';
import jsPDF from 'jspdf';
// import * as jsPDF from 'jspdf';
import {FormControl, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @Input() userdetails;
  @Input() cartIdAndPrice;
  @Output() backToshop = new EventEmitter();

  order = {
    city: '',
    street: '',
    shippingDate: '',
    creditCard: ''
  }

  orderForm = new FormGroup({
    city : new FormControl('', [Validators.required, Validators.minLength(5)]),
    street : new FormControl('', [Validators.required, Validators.minLength(2)]),
    shippingDate : new FormControl('', [Validators.required, Validators.minLength(2)]),
    creditCard : new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16),  Validators.pattern('[0-9 ]*')]),
  })

  get city(){return this.orderForm.get('city')}
  get street(){return this.orderForm.get('street')}
  get shippingDate(){return this.orderForm.get('shippingDate')}
  get creditCard(){return this.orderForm.get('creditCard')}
 

  // city = new FormControl('', [Validators.required, Validators.minLength(5)]);
  // street = new FormControl('', [Validators.required, Validators.minLength(2)]);
  // shippingDate = new FormControl('', [Validators.required, Validators.minLength(2)]);
  // creditCard = new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]);

  pdf = false;
  
  shoppingMode = false;
  dateNotAvailable = false;

  newOrder = false;

  constructor() { }

  ngOnInit(): void {

  }

  getErrorMessage() {
    const {city, street, shippingDate, creditCard} = this.orderForm.value;
    if (city.hasError('required') || street.hasError('required') ||
    shippingDate.hasError('required') || creditCard.hasError('required')) {
      return 'You must enter a value';
    }
    return creditCard.hasError('creditCard') ? 'Not a valid creditCard' : '';
  }

  // getErrorMessage() {
  //   if (this.city.hasError('required') || this.street.hasError('required') ||
  //   this.shippingDate.hasError('required') || this.creditCard.hasError('required')) {
  //     return 'You must enter a value';
  //   }
  //   return this.creditCard.hasError('creditCard') ? 'Not a valid creditCard' : '';
  // }

  goToShop(){
    this.shoppingMode = true;
    this.backToshop.emit(this.shoppingMode);
  }

  onChange({target: {value}}, field){
    // this.order[field] = value;
    if(field == 'shippingDate'){
      this.cheackOrderDate(value);
    }
  }

  autoFill({target: {value}}, field){
    console.log(field);
    console.log(this.userdetails[field]);

    // this.order[field] = this.userdetails[field];
    this.orderForm.value[field] = this.userdetails[field];
    // this.orderForm.setValue({
    //   field: this.userdetails[field],
    // })
    console.log(this.orderForm.value);

  }

  // autoFill({target: {value}}, field){
  //   this.order[field] = this.userdetails[field];

  // }

  cheackOrderDate(date){
    try {
      axios.get(`/api/order/checkDate/${date}`).then(
          (res) => {
            if(res.data.length == 3){
              this.dateNotAvailable = true;
              this.order.shippingDate = '';
              alert(` ${date} is not available - Please pick a new date`);
            }
            else{
              this.dateNotAvailable = false;
            }
          }
        );  
    } catch(err) {
        console.log(err);
    }
  }


  sbmitOrder(){
    const {city, street, shippingDate, creditCard} = this.orderForm.value;
    if(city.length <3 || 
      street.length <3 || 
      shippingDate.length < 1 || 
      creditCard.length != 16 || 
      this.dateNotAvailable){
      alert('Somting is missing');
    }
    else{
      this.saveOrder();
    }
  }

  // sbmitOrder(){
  //   if(this.order.city.length <3 || 
  //     this.order.street.length <3 || 
  //     this.order.shippingDate.length < 1 || 
  //     this.order.creditCard.length != 16 || 
  //     this.dateNotAvailable){
  //     alert('Somting is missing');
  //   }
  //   else{
  //     this.saveOrder();
  //   }
  // }



  saveOrder(){
    const {city, street, shippingDate, creditCard} = this.orderForm.value;
    let obj = {};
    obj["customer_id"] = this.userdetails._id;
    obj["cart_id"] = this.cartIdAndPrice.id;
    obj["price"] = this.cartIdAndPrice.total;
    obj["delivery_city"] = city;
    obj["delivery_street"] = street;
    obj["delivery_date"] = shippingDate;
    obj["payment_4digi"] = creditCard.slice(12,16);
    try {
      axios.post(`/api/order/addOrder`,{
        obj
      }).then(
          (res) => {
            this.newOrder = true;
            this.pdf = true
          }
        );
    } catch(err) {
      console.log(err);
    }
  }


  // saveOrder(){
  //   let obj = {};
  //   obj["customer_id"] = this.userdetails._id;
  //   obj["cart_id"] = this.cartIdAndPrice.id;
  //   obj["price"] = this.cartIdAndPrice.total;
  //   obj["delivery_city"] = this.order.city;
  //   obj["delivery_street"] = this.order.street;
  //   obj["delivery_date"] = this.order.shippingDate;
  //   obj["payment_4digi"] = this.order.creditCard.slice(12,16);
  //   try {
  //     axios.post(`/api/order/addOrder`,{
  //       obj
  //     }).then(
  //         (res) => {
  //           this.newOrder = true;
  //           this.pdf = true
  //         }
  //       );
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  startNeworder(){
    this.createNewCart();
  }

  createNewCart(){
    try {
      axios.get('/api/cart/newCartId').then(
          (res) => {
            this.goToShop();
          }
        );   
    } catch(err) {
        console.log(err);
    }
  }

  createPdf(){
    const {city, street, shippingDate, creditCard} = this.orderForm.value;
    const { invItems, total, id ,name} = this.cartIdAndPrice;
    const doc = new jsPDF();
    doc.text('GALA Shopping Site - Invoice' , 50, 30);
    doc.text(`Invoice for: ${name} ` , 15, 40);
    doc.text(`Shipping Date: ${shippingDate} ` , 15, 50);
    // doc.text(`Shipping Date: ${this.order.shippingDate} ` , 15, 50);
    doc.text(`Items ordered: ` , 15, 60);
    let start = 60;
    for(let i = 0; i < invItems.length; i++){
      start = start + 5;
      doc.text(`${invItems[i].quantity} ${invItems[i].product_id.name} $ ${invItems[i].item_price} ` , 15, start); 
    }
    doc.text(`Total price of order: $ ${total} ` , 15, start+10);
    doc.text('Thank you for shopping with us :)' , 50, start+30);
    doc.text('See you soon on your next order' , 50, start+50);
    doc.save(`invoice for ${id}`);
    this.createNewCart();
  }

}


