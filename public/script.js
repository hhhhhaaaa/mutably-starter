console.log("Sanity Check: JS is working!");

//jQuery
$(document).ready(function() {
  $('.list-group').append(createPokemonForm());
  getAllPokemon();
  $(document).on('click', '.button-create', function() {
    event.preventDefault();
    const pokemonCreate = {
      'name': $('input.createPokemonNameField').val(),
      'pokedex': $('input.createPokedexNumberField').val(),
      'evolves_from': $('input.creatPokemonEvolveField').val(),
      'image': $('input.createPokemonImageField').val()
    }
    createNewPokemon(pokemonCreate);
  });
  $(document).on('click', '.button-edit', function() {
    const id = $(this).attr('id');
    $('.list-pokemon-' + id).hide();
    $('.edit-pokemon-' + id).show();
  });
  $(document).on('click', '.button-save', function() {
    event.preventDefault();
    const id = $(this).attr('id');
    const pokeID = '.edit-pokemon-' + (id);
    const pokemonUpdate = {
      '_id': id,
      'name': $(pokeID + ' input.pokemonNameField').val(),
      'pokedex': $(pokeID + ' input.pokedexNumberField').val(),
      'evolves_from': $(pokeID + ' input.pokemonEvolveField').val(),
      'image': $(pokeID + ' input.pokemonImageField').val()
    }
    savePokemon(pokemonUpdate);
    $('.list-pokemon-' + id).show();
    $('.edit-pokemon-' + id).hide();
  });
  $(document).on('click', '.button-delete', function() {
    const id = $(this).attr('id');
    deletePokemon(id);
  });
});

//Functions

function createNewPokemon(pokemonData) {
  $.ajax({
      method: "POST",
      data: pokemonData,
      url: "https://mutably.herokuapp.com/pokemon/"
    })
    .done(function(pokemonResult) {
    $('.list-group').prepend(pokemonHTML(pokemonResult));
    })
    .catch(function(error) {
      console.log(error);
    });
}

function getAllPokemon() {
  $('list-group').html('');
  $.ajax({
      method: "GET",
      url: "https://mutably.herokuapp.com/pokemon"
    })
    .done(function(pokemonData) {
      for (i = 0; i < pokemonData.pokemon.length; i++) {
        $('.list-group').append(pokemonHTML(pokemonData.pokemon[i]));
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

function savePokemon(pokemonData) {
  const pokemonID = pokemonData._id;
  $.ajax({
      method: "PUT",
      data: pokemonData,
      url: "https://mutably.herokuapp.com/pokemon/" + pokemonID
    })
    .done(function(pokemonResult) {
    $(document).find('.whole-pokemon-' + pokemonID).html(pokemonHTML(pokemonResult))
    })
    .catch(function(error) {
      console.log(error);
    });
}

function deletePokemon(pokemonIDNumber) {
  $.ajax({
    method: "DELETE",
    url: "https://mutably.herokuapp.com/pokemon/" + pokemonIDNumber
  })
  .done(function() {
  $('.list-pokemon-' + pokemonIDNumber).remove();
  $('.edit-pokemon-' + pokemonIDNumber).remove();
  })
  .catch(function(error) {
    console.log(error);
  });
}

function createPokemonForm() {
  return `<form class='create-form form-inline'>
  Pokemon Name: <input type='text' class='createPokemonNameField form-control'> <br>
  Pokemon Pokedex #: <input type='text' class='createPokedexNumberField form-control'> <br>
  Pokemon Evolves From: <input type='text' class='creatPokemonEvolveField form-control'> <br>
  Pokemon Image: <input type='text' class='createPokemonImageField form-control'> <br>
  <button class='button-create'> Create </button>
  <br> <br>
  </form>`
}

function pokemonHTML(pokemonObject) {
  const pokemonID = pokemonObject._id;
  const pokemonName = pokemonObject.name;
  const pokedexNumber = pokemonObject.pokedex;
  const pokemonEvolve = pokemonObject.evolves_from;
  const pokemonImage = pokemonObject.image;
  return `<div class='whole-pokemon-${pokemonID}'>
  <li class='list-pokemon-${pokemonID}'> Pokemon ID: ${pokemonID} <br>
  Pokemon Name: ${pokemonName} <br>
  Pokemon Pokedex #: ${pokedexNumber} <br>
  Pokemon Evolves From: ${pokemonEvolve} <br>
  Pokemon Image: <img src='${pokemonImage}'> <br>
  <button class='button-edit' id='${pokemonID}'> Edit </button> <button class='button-delete' id='${pokemonID}'> Delete </button> </li>
  <br> <br>

  <form class='edit-form edit-pokemon-${pokemonID} form-inline'>
  Pokemon Name: <input type='text' class='pokemonNameField form-control' value='${pokemonName}'> <br>
  Pokemon Pokedex #: <input type='text' class='pokedexNumberField form-control' value='${pokedexNumber}'> <br>
  Pokemon Evolves From: <input type='text' class='pokemonEvolveField form-control' value='${pokemonEvolve}'> <br>
  Pokemon Image: <input type='text' class='pokemonImageField form-control' value='${pokemonImage}'> <br>
  <button class='button-save' id='${pokemonID}'> Save </button>
  </form>
  <br> <br>
  </div>`
}
