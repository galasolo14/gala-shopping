import { Component, OnInit, Input } from '@angular/core';
import axios from 'axios';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import {Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @Input() allProductes;
  @Input() userType;
  @Output() toEdit = new EventEmitter();
  @Output() updateCart = new EventEmitter();

  itemAddToCart = {};
  userAdmin = '';
  constructor(public dialog: MatDialog) { 
  }

  ngOnInit(): void {
       this.userAdmin = this.userType;
  }
  
  onAddToCart(id, price, qnt){
      if(id && qnt ){
      try {
        axios.post('/api/cart/addItem', {
          product_id: id,
          quantity: qnt,
          item_price: price*qnt,
          }).then(
            (res) => {
              if(res.status == 200){
                this.toUpdateCart();
              }
            }
          ); 
      } catch(err) {
          console.log(err);
      }
    }
    else{
      alert('Somthing is missing');
    } 
  }

  openDialog(idx){
    const {priceOption, name, _id, price} = this.allProductes[idx];
    let dialogRef = this.dialog.open(DialogComponent, {data: {option: priceOption, name}});
    dialogRef.afterClosed().subscribe(result => {
      if(result != "cancel"){
        this.onAddToCart(_id, price, result);
      }
    });
  }

  edit(idx){
    let productObj = this.allProductes[idx];
    this.toEdit.emit(productObj);
  }

  toUpdateCart(){
    this.updateCart.emit(true);
  }

}
