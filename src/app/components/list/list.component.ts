import { Component, OnDestroy, OnInit } from '@angular/core';
import { concat,Subscription } from 'rxjs';
import { ApiserviceService } from '../../services/apiservice.service';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [NgFor,RouterLink,TitleCasePipe,NgIf,RouterOutlet,NgClass],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit,OnDestroy {
  typeColorMap :any= {
    'normal': 'bg-gray-300',
    'fire': 'bg-orange-500',
    'water': 'bg-blue-500',
    'electric': 'bg-yellow-500',
    'grass': 'bg-green-500',
    'ice': 'bg-teal-400',
    'fighting': 'bg-red-700',
    'poison': 'bg-purple-500',
    'ground': 'bg-yellow-700',
    'flying': 'bg-indigo-500',
    'psychic': 'bg-pink-500',
    'bug': 'bg-lime-500',
    'rock': 'bg-orange-500',
    'ghost': 'bg-indigo-900',
    'dragon': 'bg-indigo-700',
    'dark': 'bg-gray-800',
    'steel': 'bg-slate-500',
    'fairy': 'bg-pink-300'
  };



  loading:boolean=false;
  subscriptions:Subscription[]=[];
  constructor(private api:ApiserviceService) {}
 
   get pokemons():any[]{
    return this.api.pokemons;
   }
   set subscription(subscription:Subscription){
    this.subscriptions.push(subscription)
   }

    

  ngOnInit(): void {
    if(!this.pokemons.length)
      this.loadmore();
    
    }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription=>subscription ? subscription.unsubscribe():0)
}
  
loadmore():void {
  this.loading=true;
  this.subscription = this.api.getNext().subscribe(response=>{
    this.api.next=response.next;
    const details=response.results.map((i:any)=>this.api.get(i.name));
    this.subscription=concat(...details).subscribe((response:any)=>{
      this.api.pokemons.push(response);
    });
  
  }, error=>console.log('Error Occured:',error),()=>this.loading=false);
}

getType(pokemon:any):string{
  
 // const info=this.api.getType(pokemon);
  console.log(pokemon.type)
  //return this.api.getType(pokemon);
  return this.typeColorMap[pokemon.types[0].type.name] || 'bg-gray-500';
}

  }
  

