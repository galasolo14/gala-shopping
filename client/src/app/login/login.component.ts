import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import axios from 'axios';
import {Output, EventEmitter} from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() userInfo = new EventEmitter();

  hide = true;

  // userEmail = '';
  // email = new FormControl('', [Validators.required, Validators.email]);
  // password = '';

  user = '';
  userConected = false;
  totalProducts = null;
  totalOrders = null;

  cartOpen = false;
  orderDone = false;
  newUser = false;

  cart_id = '';
  cart_open_date= '';
  lastOrder = '';

  loginForm = new FormGroup({
    userEmail : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')])
  })

 
  get userEmail(){return this.loginForm.get('userEmail')}
  get password(){return this.loginForm.get('password')}

  constructor(private router:Router) {
    this.router = router;
   }

  ngOnInit(): void {
    this.fetchShopData();
  }

  // getErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     return 'You must enter a value';
  //   }
  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }

  // nameType({target: {value}}){
  //   this.userEmail = value;
  // }

  // passwordType({target: {value}}){
  //   this.password = value;
  // }

  onClickSignup(){
    this.router.navigate(['signup']);
  }

  onClickLogin(){
    // this.email.hasError('email')
    console.log(this.loginForm.value);
    const {userEmail, password} = this.loginForm.value;
    if(
      userEmail.length < 5 || 
      password.length <4){
        alert('invalid input - Somthing is missing');
    }
    else{
     this.login();
    //  this.userEmail = '';
    //  this.password = '';
    }
  }


  onStart(){
    console.log(this.newUser)
    if(this.newUser){
      this.createNewCart();
    }
    console.log(this.orderDone, this.cartOpen);
    if(this.orderDone && !this.cartOpen){
      this.createNewCart();
    }
    else{
      this.router.navigate(['shop']);
    } 
  }


  login(){
    console.log('login fun');
    try {
      axios.post('/api/auth/login', {
        username: this.loginForm.value.userEmail, password: this.loginForm.value.password}).then(
          (res) => {
            this.user = res.data;
            if(res.data){
              this.userConected = true;
              if(!res.data.isAdmin){
                this.fetchCartData();
              }
              else{
                this.router.navigate(['shop']);
              } 
            }
            this.userInfo.emit(this.user);
          }
        );
    } catch(err) {
        alert('Email or Password is not valid ');
        console.log(err);
    }
  }

  fetchShopData(){
    try {
      axios.get('/api/shop/shopData').then(
          (res) => {
            this.totalProducts = res.data.productCount;
            this.totalOrders = res.data.orderCount;
          }
        );   
    } catch(err) {
        console.log(err);
    }
  }

  fetchCartData(){
    console.log('fetchCartData func');
    
    try {
      axios.get('/api/cart/getCartId').then(
          (res) => {
            if(res.status == 200){
              const {cart, orderLast } = res.data;
              console.log(cart.length, res.data);
              if(cart.length > 0){
                console.log(cart.length);
                console.log(orderLast);
                this.cartOpen = true;
                this.cart_id = cart[0]._id;
                this.cart_open_date = cart[0].created_at.slice(0,10);
              }
              // if(orderLast.length > 0)
              if(orderLast && orderLast._id){
                console.log(orderLast.length);
                console.log(orderLast._id);
                console.log(orderLast);
                this.orderDone = true;
                this.lastOrder = orderLast.updated_at.slice(0,10);
              }
              if(cart.length == 0 && orderLast.length == 0){
                console.log(cart.length == 0 && orderLast == 0);
                console.log(orderLast.length);
                this.newUser = true;
              }
            }
          }
        );
    } catch(err) {
        console.log(err);
    }
  }

  createNewCart(){
    try {
      axios.get('/api/cart/newCartId').then(
          (res) => {
            if(res){
              this.router.navigate(['shop']);
            } 
          }
        );   
    } catch(err) {
        console.log(err);
        if( err.status === 401){
          this.router.navigate(['login']);
        }
    }
  }

  removeUserInfo(){
    this.userConected = false;
  }
  
}
