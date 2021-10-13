import { Component, OnInit , Inject} from '@angular/core';
import { MAT_DIALOG_DATA,  } from '@angular/material/dialog';
import {FormControl, Validators, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  // quantityForm = new FormGroup({
  //   price : new FormControl('', [Validators.required, Validators.minLength(1), Validators.pattern('[0-9]+(\\.[0-9][0-9]?)?')]),
  // })

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }



  ngOnInit(): void {
    
  }

}
