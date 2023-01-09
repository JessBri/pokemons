import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MessageService } from './message.service';
import { Pokemon } from './pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {


  private apiPokemons = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/pkm-msaevaluation/pokemon';
  private apiPokemonId = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/pkm-msaevaluation/pokemon/?idAuthor=1';

  httpOptions = {
    headers: new HttpHeaders({ 'Accept': '*/*', 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT', 'Access-Control-Allow-Headers': 'append,delete,entries,foreach,get,has,keys,set,values,Authorization' })
  };

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.apiPokemonId, this.httpOptions)
      .pipe(
        catchError(this.handleError<Pokemon[]>('getPokemons', []))
      );
  }

  /** PUT: update the pokemon on the server */
  updatePokemon(pokemon: Pokemon): Observable<any> {
    return this.http.put(this.apiPokemons + pokemon.id, pokemon, this.httpOptions).pipe(
      tap(_ => this.messageService.add(`Pokemon actualizado exitosamente: ${pokemon.name}`)),
      catchError(this.handleError<any>('updatePokemon'))
    );
  }

  /** POST: add a new pokemon to the server */
  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.apiPokemons, pokemon).pipe(
      tap((newPokemon: Pokemon) => this.messageService.add(`Pokemon creado exitosamente: ${newPokemon.name}`)),
      catchError(this.handleError<Pokemon>('addPokemon'))
    );
  }

  /** DELETE: delete the pokemon from the server */
  deletePokemon(pokemon: Pokemon | number): Observable<Pokemon> {
    const id = typeof pokemon === 'number' ? pokemon : pokemon.id;
    const url = `${this.apiPokemons}/${id}`;

    return this.http.delete<Pokemon>(this.apiPokemons + id, this.httpOptions).pipe(
      tap(_ => this.messageService.add(`Pokemon eliminado exitosamente`)),
      catchError(this.handleError<Pokemon>('deletePokemon'))
    );
  }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messageService.add(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
