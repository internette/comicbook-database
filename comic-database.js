// simple-todos.js
ComicsList = new Mongo.Collection('comics');
if (Meteor.isClient) {
  // This code only runs on the client
  Template.allComics.helpers({
    'comic':function(){
      return ComicsList
    }
  });
  Template.marvel.helpers({
    'comic': function(lowercase){
      return ComicsList.find({ publisher: "Marvel"}).fetch();

    }
  });
  Template.newComic.events({
    'submit form': function(event){
      event.preventDefault();
      $('#submitButton').keyup(function(){
          this.value = this.value.toLowerCase();
      });
      var publisherVar = event.target.publisher.value;
      var superheroVar = event.target.superhero.value;
      var movieNameVar = event.target.movieName.value;
      var firstAppearance = event.target.appearance.value;
      ComicsList.insert({
        publisher: publisherVar,
        superhero: superheroVar,
        movieName: movieNameVar,
        appearance: firstAppearance
      });
    }
});
}
if(Meteor.isServer){
    console.log("Complete");
}
Router.map( function () {
  this.route('marvel');
  this.route('dccomics');
  this.route('home',{
    path: '/'
  });
  this.route('heroDetails', {
    path: '/marvel/herodetails/:_id',
    data: function(){
      _id = this.params._id;
      return ComicsList.findOne(this.params._id)
    }
  })
});