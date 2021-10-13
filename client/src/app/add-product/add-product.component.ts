import { Component, OnInit ,Input} from '@angular/core';
import axios from 'axios';
import {FormControl, Validators, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  @Input() editProduct;

  addProductForm = new FormGroup({
    name : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]),
    category : new FormControl('', [Validators.required]),
    price : new FormControl('', [Validators.required, Validators.minLength(1), Validators.pattern('[0-9]+(\\.[0-9][0-9]?)?')]),
    priceOption : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
    picture : new FormControl('', [Validators.required, Validators.minLength(4)])
  })

  get name(){return this.addProductForm.get('name')}
  get category(){return this.addProductForm.get('category')}
  get price(){return this.addProductForm.get('price')}
  get priceOption(){return this.addProductForm.get('priceOption')}
  get picture(){return this.addProductForm.get('picture')}
  


  product ={
    name: '',
    category: 'None',
    price: '',
    priceOption: '',
    picture:''
  };

  savePicture= '';
  editMode = false;
  

  constructor() { }

  ngOnInit(): void {
    
  }

  clearInputs(){
    // this.product = {
    //   name: '',
    //   category: 'None',
    //   price: '',
    //   priceOption: '',
    //   picture:''
    // };
   
    this.addProductForm.reset({
      name: '',
      category: '',
      price: '',
      priceOption: '',
      picture:''
    })

   
  }

  nweProduct(){
    this.editMode = false; 
    this.clearInputs();
  }

  // onChange({target: {value}}, field){
  //   this.product[field] = value;
  // }

  fileChange(event){
    this.savePicture = event.target.files[0];
    // this.product.picture = `img/${event.target.files[0].name}`;
    this.addProductForm.value.picture = `img/${event.target.files[0].name}`
  }



  savePic(){
    const myFormData = new FormData();
    myFormData.append('file', this.savePicture);
    fetch('/api/upload', {
      method: 'POST',
      body: myFormData
    }).then(res => res.json())
      .then(data => {
        if(data){
          alert('Picture was saved');
        }
      }).catch(err => {
        console.log(err);
      });
  }

  saveproduct(){
    console.log(this.addProductForm.value);
    try {
      axios.post('/api/shopping/add', {
        product: this.addProductForm.value
      }).then(
          (res) => {
            if(res.status == 200)
            alert('Product was add  successfully');
            this.clearInputs();
          }
        );
    } catch(err) {
        console.log(err);
    }
  }

  onSave(){
    const {name, category, price, priceOption,  picture} = this.addProductForm.value;
    if(
      (name.length < 2 && name.length > 15)|| category == 'None' ||
      price.length ==0 || priceOption.length <2 ||
      picture.length < 7){
        alert('invalid input - somting is missing');
    }
    else{
      this.savePic();
      this.saveproduct();
    }
  }

  ngOnChanges(): void {
    if(this.editProduct){
      this.editProductInpits();
    }
  }

  editProductInpits(){
    this.editMode = true;
    // console.log(this.editProduct);
    // this.addProductForm.value.name = this.editProduct.name ;
    // this.addProductForm.value.category = this.editProduct.category;
    // this.addProductForm.value.price = this.editProduct.price;
    // this.addProductForm.value.priceOption = this.editProduct.priceOption;
    // this.addProductForm.value.picture = this.editProduct.picture;
    // console.log(this.addProductForm.value);
    this.addProductForm.setValue({
      name: this.editProduct.name,
      category: this.editProduct.category,
      price:  this.editProduct.price,
      priceOption: this.editProduct.priceOption,
      picture: this.editProduct.picture
    })
    console.log(this.addProductForm.value);
  }

  onSaveEdit(){
    try {
      axios.post('/api/shopping/edit', {
        product: this.addProductForm.value,
        id: this.editProduct._id
      }).then(
          (res) => {
            console.log(res);
            if(res.status == 200){
              this.clearInputs();
              console.log( res.data);
              alert('Changes submitted');
              this.editMode = false;
            }
          }
        ); 
    } catch(err) {
        console.log(err);
    }
  }
  
}
