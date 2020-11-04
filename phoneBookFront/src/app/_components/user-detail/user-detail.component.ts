import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/_models/userModel';
import { UserOp } from 'src/app/_models/userOp';
import { UserService } from 'src/app/_services/userService';
import { AlertaComponent, ConfirmDialogModel } from '../alerta/alerta.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  UserForm: FormGroup;
  enableBtn = false;
  iduser = 0;
  esperando = false;
  successFalse = false;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              public dialogRef: MatDialogRef<UserDetailComponent>,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: UserOp) { }

  ngOnInit() {

    this.UserForm = this.formBuilder.group({
      name: [{ value: ''}, Validators.required],
      email: [{ value: ''}, [Validators.required, Validators.email]],
      lastname: [{ value: ''}],
      firstname: [{ value: ''}, Validators.required],
      phone: [{ value: ''}, Validators.required],
      address: [{ value: ''}, Validators.required]
    });

    if (this.data.Operation === 'EDITAR') {

      this.userService.getUserById(this.data.User.id).then( e => {
        if (e != null) {
          this.iduser = this.data.User.id;
          this.UserForm.get('email').setValue(this.data.User.email);
          this.UserForm.get('name').setValue(this.data.User.name);
          this.UserForm.get('lastname').setValue(this.data.User.lastName);
          this.UserForm.get('firstname').setValue(this.data.User.firstName);
          this.UserForm.get('phone').setValue(this.data.User.phone);
          this.UserForm.get('address').setValue(this.data.User.address);
        }
      } ).catch(err => {
        console.log('Error' + err);
      });
    }
  }

  cancel(): void {
    const dialogData = new ConfirmDialogModel('Confirmar', '¿Quiere cerrar sin guardar?');
    const dialogRefConfirmar = this.dialog.open(AlertaComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRefConfirmar.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.dialogRef.close(false);
      }
    });
  }

  save(): void {
    this.esperando = true;
    const user = new User();
    user.email = this.UserForm.get('email').value;
    user.name = this.UserForm.get('name').value;
    user.firstName = this.UserForm.get('firstname').value;
    user.lastName = this.UserForm.get('lastname').value;
    user.phone = Number(this.UserForm.get('phone').value);
    user.address = this.UserForm.get('address').value;

    if (this.iduser > 0) {
        user.id = this.iduser;
        this.userService.updateUser(this.iduser, user).then(res => {
          if (res) {
            this.esperando = false;
            this.dialogRef.close(true);
          } else {
            this.successFalse = true;
            this.esperando = false;
          }
        }).catch(err => {
          console.log('Error' + err);
        }).finally(() => {

        });
    } else {
        this.userService.createUser(user).then(res => {
          if (res) {
            this.esperando = false;
            this.dialogRef.close(true);
          } else {
            this.successFalse = true;
            this.esperando = false;
          }
        }).catch(err => {
          console.log('Error' + err);
        }).finally(() => {

        });
    }
  }
}
