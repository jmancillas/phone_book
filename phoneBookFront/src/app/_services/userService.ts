import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseRest } from '../_models/responseRest';
import { User } from '../_models/userModel';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
  })
  export class UserService {

    constructor(private http: HttpClient) { }

    getAllUsers():Promise<User[]>{
        return this.http.get<User[]>(`${environment.apiUrl}`).toPromise();
    }
    getUserById(id: number):Promise<User[]>{
        return this.http.get<User[]>(`${environment.apiUrl}/${id}`).toPromise();
    }
    createUser(user: User): Promise<ResponseRest<string>> {
        return this.http.post<ResponseRest<string>>(`${environment.apiUrl}`, user).toPromise();
    }
    updateUser(id: number,user: User): Promise<ResponseRest<string>> {
        return this.http.put<ResponseRest<string>>(`${environment.apiUrl}/${id}`, user).toPromise();
    }
    delete(id: number){
        return this.http.delete<ResponseRest<string>>(`${environment.apiUrl}/${id}`, );
    }   
}