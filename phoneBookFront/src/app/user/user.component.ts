import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator/typings/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertaComponent, ConfirmDialogModel } from '../_components/alerta/alerta.component';
import { UserDetailComponent } from '../_components/user-detail/user-detail.component';
import { User } from '../_models/userModel';
import { first } from 'rxjs/operators';
import { UserService } from '../_services/userService';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  displayedColumns: string[] = ['Nombre', 'Telefono', 'Correo', 'Contacto', 'Acciones'];
  dataSource = new MatTableDataSource<User>();

  loading = false;
  error = false;
  errorMessage = '';

  pageEvent: PageEvent;
  datasource: null;
  pageIndex = 0;
  pageSize = 20;
  length = 0;
  filtro = '';

  buscando = false;

  constructor(public dialog: MatDialog, private userService: UserService, private formBuilder: FormBuilder) { }

  createuser(): void {
    const dialogRef = this.dialog.open(UserDetailComponent, {
      width: '500px',
      data: {Operation: 'NUEVO'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    });
  }

  edituser(user: User): void {
    const dialogRef = this.dialog.open(UserDetailComponent, {
      width: '500px',
      data: {Operation: 'EDITAR', User: user}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result ) {
        this.getUsers();
      }
    });
  }

  deleteUser(user: User) {
    const dialogData = new ConfirmDialogModel('Confirmar', '¿Está seguro de que quiere borrar el usuario?');
    const dialogRef = this.dialog.open(AlertaComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.userService.delete(user.id)
        .pipe(first())
        .subscribe(
            data => {
              if (data) {
                this.getUsers();
              }
            },
            error => {
              this.error = true;
              this.errorMessage = 'Error al eliminar el usuario';
          });
        }
    });
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getAllUsers().then( respuesta => {
      this.dataSource = new MatTableDataSource<User>(respuesta);
      this.length = respuesta.length;
      this.loading = false;
    } ).catch(err => {
      console.log('Error' + err);
    });
  }

}
