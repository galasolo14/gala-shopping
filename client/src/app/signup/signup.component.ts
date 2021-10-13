import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import axios from 'axios';
import {FormControl, Validators, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user = {
    firstName: '',
    lastName: '',
    city: '',
    street: '',
    email: '',
    password: ''
  }

  hide = true;

  // signupForm : FormGroup;

  signupForm = new FormGroup({
    firstName : new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]),
    lastName : new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]),
    city : new FormControl('', Validators.required),
    street : new FormControl('', [Validators.required, Validators.minLength(2)]),
    email : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')])
// , Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')
  })

  get firstName(){return this.signupForm.get('firstName')}
  get lastName(){return this.signupForm.get('lastName')}
  get city(){return this.signupForm.get('city')}
  get street(){return this.signupForm.get('street')}
  get email(){return this.signupForm.get('email')}
  get password(){return this.signupForm.get('password')}
  
  // firstName =  new FormControl('', [Validators.required, Validators.minLength(2)]);
  // lastName = new FormControl('', [Validators.required, Validators.minLength(2)]);
  // city = new FormControl('', [Validators.required, Validators.minLength(5)]);
  // street = new FormControl('', [Validators.required, Validators.minLength(2)]);
  // email = new FormControl('', [Validators.required, Validators.email]);
  // password = new FormControl('', [Validators.required, Validators.minLength(4)]);

  constructor(private router:Router) {
    this.router = router;
   }
  //  Validators.pattern('[a-zA-Z]')

  ngOnInit(): void {
    // this.signupForm = new FormGroup({
    //   firstName : new FormControl('', [Validators.required, Validators.minLength(2)]),
    //   lastName : new FormControl('', [Validators.required, Validators.minLength(2)]),
    //   city : new FormControl('', [Validators.required, Validators.minLength(5)]),
    //   street : new FormControl('', [Validators.required, Validators.minLength(2)]),
    //   email : new FormControl('', [Validators.required, Validators.email]),
    //   password : new FormControl('', [Validators.required, Validators.minLength(4)])
    // })
  }

  // getErrorMessage() {
  //   if (this.email.hasError('required') || this.password.hasError('required') ||
  //   this.firstName.hasError('required') || this.lastName.hasError('required') ||
  //   this.city.hasError('required') || this.street.hasError('required')) {
  //     return 'You must enter a value';
  //   }
  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }

  getErrorMessage() {
    const {firstName, lastName ,city ,street ,email, password} = this.signupForm.value;
    if (email.hasError('required') || password.hasError('required') ||
    firstName.hasError('required') || lastName.hasError('required') ||
    city.hasError('required') || street.hasError('required')) {
      return 'You must enter a valid name';
    }
    return email.hasError('email') ? 'Not a valid email' : '';
  }

  // onChange({target: {value}}, field){
  //   this.user[field] = value;
  // }

  onClickLogin(){
    this.router.navigate(['login']);
  }

  clickOnSignup(){
    console.log(this.user);
    console.log(this.signupForm.value);
    // email.hasError('email') ||

    const {firstName, lastName ,city ,street ,email, password} = this.signupForm.value;
    if(firstName.length < 2 || 
      lastName.length < 2 || 
      city.length < 2 || 
      street.length < 2 || 
      email.length < 5 || 
      password.length <4){
        alert('invalid input - Somthing is missing');
    }
    else{
      this.signup();
    }
  }

  signup(){
    try {
      axios.post('/api/auth/signup', {
        // user: this.user
        user: this.signupForm.value
      }).then(
          (res) => {
            console.log(res);
            this.router.navigate(['login']);
          }
        );  
    } catch(err) {
        console.log(err);
    }
  }

}
