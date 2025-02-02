import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiserviceService } from '../../services/apiservice.service';
import { NgFor, NgIf, NgStyle, TitleCasePipe } from '@angular/common';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-view',
  standalone: true,
  imports: [NgIf, TitleCasePipe, NgFor, RouterLink, RouterOutlet,NgStyle],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit, OnDestroy {
  pokemon: any = null;
  subscriptions: Subscription[] = [];
  desc: string = '';

  constructor(
    private route: ActivatedRoute,
    private pokemonservice: ApiserviceService,
    private shared: SharedService
  ) {}

  private addSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    this.addSubscription(
      this.route.params.subscribe((params) => {
        if (this.pokemonservice.pokemons.length) {
          this.pokemon = this.pokemonservice.pokemons.find(
            (i) => i.name === params['name']
          );
          if (this.pokemon) {
            this.getEvolution();
            return;
          }
        }
        console.log(params['name']);
        this.addSubscription(
          this.pokemonservice.get(params['name']).subscribe(
            (response) => {
              this.pokemon = response;
              this.getEvolution();
            },
            (error) => console.log('Error Occurred:', error)
          )
        );
      })
    );
    this.getDescription();
   
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }

  getEvolution(): void {
    if (!this.pokemon.evolutions || !this.pokemon.evolutions.length) {
      this.pokemon.evolutions = [];
      this.addSubscription(
        this.pokemonservice.getSpecies(this.pokemon.name).subscribe((response) => {
          const id: any = this.getId(response.evolution_chain.url);
          console.log(this.subscriptions);
          this.addSubscription(
            this.pokemonservice.getEvalution(id).subscribe((response) =>
              this.getEvolves(response.chain)
            )
          );
          console.log(response);
        })
      );
    }
  }

  getEvolves(chain: any): void {
    this.pokemon.evolutions.push({
      id: this.getId(chain.species.url),
      name: chain.species.name,
    });
    if (chain.evolves_to.length) {
      this.getEvolves(chain.evolves_to[0]);
    }
  }

  getId(url: string): number {
    const spliturl = url.split('/');
    return +spliturl[spliturl.length - 2];
  }

  setId(id: any): void {
    this.shared.updateData(id);
    console.log(id);
    this.getDescription();
    console.log(this.pokemon)
  }

 

  getDescription(): void {
    if (this.pokemon) {
      this.addSubscription(
        this.pokemonservice.getSpeciesbyid().subscribe((data) => {
          if (data?.flavor_text_entries?.length) {
            this.desc = data.flavor_text_entries[0].flavor_text;
            console.log(this.desc);
          }
        })
      );
    }
  }
  getType(pokemon: any): string {
    const typeColors: { [key: string]: string } = {
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
  
    if (pokemon.types && pokemon.types.length > 0) {
      const type = pokemon.types[0].type.name;  
      return typeColors[type] || 'bg-gray-400';  
    }
    return 'bg-gray-400';
  }
  
  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
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
    return typeColors[type] || 'bg-gray-400';
  }

getStatColor(statValue: number): string {
  if (statValue >= 200) return 'bg-green-500'; // High stats
  if (statValue >= 150) return 'bg-yellow-500'; // Medium-high stats
  if (statValue >= 100) return 'bg-orange-500'; // Medium stats
  return 'bg-red-500'; // Low stats
}
}