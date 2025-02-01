import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiserviceService } from '../../services/apiservice.service';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [NgIf, TitleCasePipe, NgFor, RouterLink, RouterOutlet],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit, OnDestroy, DoCheck {
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
  }

  ngDoCheck(): void {
    this.getDescription();
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
}