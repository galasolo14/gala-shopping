import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import axios from 'axios';
import {Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() userName;
  @Output() userLogout = new EventEmitter();

  userIn = false;
  name = '';

  constructor(private router:Router) {
    this.router = router;
   }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
    if(this.userName){
      this.name = this.userName.firstName;
      this.userIn = true;
    }
  }

  onClickLogout(){
    try {
      axios.get('/api/auth/logout').then(
          (res) => {
            this.router.navigate(['login']);
            this.userIn = false;
            this.userLogout.emit(this.userIn);
          }
        );  
    } catch(err) {
        console.log(err);
    }
  }

}
