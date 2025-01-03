import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {
  private url:string='https://pokeapi.co/api/v2/pokemon/'
private _pokemons:any[]=[]
private _next:string='';

  constructor(private http:HttpClient) { }
 get pokemons():any[]{
  return this._pokemons;
 }

 get next():string{
  return this._next;

 }
 set next(next:string){
  this._next=next;

 }

 getType(pokemon:any):string{
  return pokemon && pokemon.types.length > 0 ? pokemon.types[0].type.name:'';
 }

 get(name:string):Observable<any>{
  const url=`${this.url}${name}`
  return this.http.get(url);
 }
 getNext():Observable<any>{
    const url= this.next ===''?`${this.url}?limit=100`:this.next;
    return this.http.get(url)
 }
 getEvalution(id:number):Observable<any>{
  const url=`https://pokeapi.co/api/v2/evolution-chain/${id}`
  return this.http.get(url)
 }
 getSpecies(name:string):Observable<any>{
  const url=`https://pokeapi.co/api/v2/pokemon-species/${name}`
  return this.http.get(url)
  
 }
 getSpeciesbyid(id:any):Observable<any>{
  const url=`https://pokeapi.co/api/v2/pokemon-species/${id}`
  return this.http.get(url)
  
 }
}
