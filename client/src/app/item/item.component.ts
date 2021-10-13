import { Component, OnInit, Input } from '@angular/core';
import axios from 'axios';
import {Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() cartItems;
  @Input() finishOrder;
  @Output() refreshCartItems = new EventEmitter();
  
  showItems = false
  orderMode = false;
  constructor() { }

  ngOnInit(): void {
    if(this.cartItems.length>0){
      this.showItems = true;
    }
  }

  onClick(idx){
    this.deleteItemFromCart(this.cartItems[idx]._id)
  }

  deleteItemFromCart(itemId){
    console.log('deleteItemFromCart');
    console.log(itemId);
    try {
      axios.delete(`/api/cart/delete/${itemId}`).then(
          (res) => {
            if(res.status == 200){
              this.refreshCartItems.emit();
            }
          }
        );
      
    } catch(err) {
        console.log(err);
    }
  }

  ngOnChanges(): void {
    if(this.cartItems.length>0){
      this.showItems = true;
    }
    this.orderMode = this.finishOrder;
  }

}
