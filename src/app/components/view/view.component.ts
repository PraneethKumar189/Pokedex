import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiserviceService } from '../../services/apiservice.service';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [NgIf,TitleCasePipe,NgFor,RouterLink,RouterOutlet],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit,OnDestroy{
pokemon:any=null;
subscriptions:Subscription[]=[];

constructor(private route:ActivatedRoute,private pokemonservice:ApiserviceService){}

set subscription(subscription:Subscription){
  this.subscriptions.push(subscription);
}

  ngOnInit(): void {
    this.subscription=this.route.params.subscribe(params=>{
      if(this.pokemonservice.pokemons.length){
        this.pokemon=this.pokemonservice.pokemons.find(i=>i.name === params['name']);
        if(this.pokemon){
          this.getEvolution();
          return;

          
        }
      }
       console.log(params['name'])
      this.subscription=this.pokemonservice.get(params['name']).subscribe(response=>{
        this.pokemon=response;
        this.getEvolution();

      },error=>console.log('Error Occured:',error))
    })
    this.getDescription()
  }
  ngOnDestroy():void{
         this.subscriptions.forEach(subscription=>subscription ? subscription.unsubscribe():0)
  }
  getEvolution():any {
    if (!this.pokemon.evolutions || !this.pokemon.evolutions.length){
      this.pokemon.evolutions=[]
      this.subscription=this.pokemonservice.getSpecies(this.pokemon.name).subscribe(response=>{
        const id:any =this.getId(response.evolution_chain.url);
        sessionStorage.setItem('sid',id)
       // this.subscriptions.push()
       console.log(this.subscriptions)
        this.subscription=this.pokemonservice.getEvalution(id).subscribe(response=> this.getEvolves(response.chain));
        console.log(response)
      })
    }
  }
  getEvolves(chain: any): void {
    this.pokemon.evolutions.push({
      id:this.getId(chain.species.url),
      name:chain.species.name
    });
    if(chain.evolves_to.length){
      this.getEvolves(chain.evolves_to[0]);
    }
  }
  getId(url: string) :number{
    const spliturl=url.split('/');
    return +spliturl[spliturl.length-2]
  }
 desc:string='';
  getDescription(){
    const id:any=sessionStorage.getItem('sid');
    
    return this.pokemonservice.getSpeciesbyid(id).subscribe(data=>{
      
      this.desc=data.flavor_text_entries[0].flavor_text;
      console.log(this.desc)
    })
      
  }
}
