import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AddNewproductDialogComponent } from '../add-newproduct-dialog/add-newproduct-dialog.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  addproductdialog(){
    this.dialog.open(AddNewproductDialogComponent)
}

  ngOnInit(): void {
  }

}
