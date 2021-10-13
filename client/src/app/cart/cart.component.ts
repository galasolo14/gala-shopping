import { Component, OnInit , Input} from '@angular/core';
import axios from 'axios';
import {Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  @Input() userData;
  @Input() productForEdit;
  @Input() needToUpdate;
  @Input() backShopping;
  @Output() orderinfo = new EventEmitter<object>();
  
  
  items = [];
  userName = '';
  admin = '';
  cartId = '';

  total = 0;
  productForSend = null;
  orderMode = false; 
 
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.fetchCartData();
  }

  ngOnChanges(): void {
    if(this.userData){
      this.userName = this.userData.firstName;
      this.admin = this.userData.isAdmin;
      if(!this.admin){
        this.fetchCartData();
      }
    }
    if(this.backShopping){
      this.orderMode = false;
    }
    if(this.productForEdit){
      this.productForSend = this.productForEdit;
    }
    if(this.needToUpdate){
      this.fetchCartItems();
    }
  }

  fetchCartData(){
    if(this.cartId.length == 0){
      try {
        axios.get('/api/cart/getCartId').then(
            (res) => {
              if(res.status == 200){
                console.log(res.data);
                this.cartId = res.data.cart[0]._id;
                this.fetchCartItems();
              }
            }
          );
      } catch(err) {
        if(err.status === 401){
          this.router.navigate(['login']);
        }
          console.log(err.status);
      }
    }
    
  }

  fetchCartItems(){
    try {
      axios.get(`/api/cart/getCartItems/${this.cartId}`).then(
          (res) => {
            this.items = res.data.row;
            if(this.items.length > 0){
              this.totalPrice(this.items);
            }
          }
        ); 
    } catch(err) {
      if( err.status === 401){
        this.router.navigate(['login']);
      }
        console.log(err);
    }
  }

  order(cartId, price){
    const data = {'id': cartId, 'total': price, invItems: this.items, name: this.userName};
    this.orderinfo.emit(data);
    this.orderMode = true;
  }
  
  totalPrice(items){
    this.total = 0;
    for (let i=0; i<items.length; i++){
      this.total = this.total + items[i].item_price;
    }
  }

  getItems(){
    this.fetchCartItems();
  }

}
