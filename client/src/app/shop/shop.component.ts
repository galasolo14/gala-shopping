import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  showCategories = false;
  categories = [];
  products = [];
  showProductes = false;
  showOrder = false;
  showShop = true;
  orderinfo='';

  user = '';
  dataOrder = '';
  productEdit = '';
  shouldUpdateCart = 0;
 
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.fetchCategory();
  }

  onClick(categoryId){
    this.fetchProducts(categoryId);
    this.showProductes = true;
  }

  fetchCategory(){
    try {
      axios.get(`/api/shopping/category`).then(
          (res) => {
            this.categories = res.data.row;
            this.user = res.data.user.user;
            this.showCategories = true;
          }
        );
    } catch(err) {
      if(err.status === 401){
        this.router.navigate(['login']);
      }
      console.log(err);
    }
  }
  
  fetchProducts(id){
    try {
      axios.get(`/api/shopping/${id}`).then(
          (res) => {
            this.products = res.data.sort ( (a, b) => {
              let nameA = a.name.toLowerCase();
              let nameB = b.name.toLowerCase();
              if(nameA < nameB){
                return -1;
              }
            });
          }
        );
    } catch(err) {
      if(err.status === 401){
        this.router.navigate(['login']);
      }
      console.log(err);
    }
  }

  moveToOrder(data){
    this.dataOrder = data;
    this.showOrder=true;
    this.showShop=false;
  }

  moveToShop(result){
    this.showOrder=false;
    this.showShop=true;

  }

  productToEdit(data){
    this.productEdit = data;
  }
  
  
  refreshCart(value){
    this.shouldUpdateCart = this.shouldUpdateCart +1;
  }

}
