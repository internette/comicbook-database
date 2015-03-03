Comics = new Mongo.Collection('comics');
if (Meteor.isClient) {
  Template.Home.helpers({
    publishers: function(){
      var makeIntoArray = Comics.find().fetch();
      var uniqueArray = _.uniq(makeIntoArray, false, function(e){return e.publisher});
      return uniqueArray;
    }
  });
  Template.Home.events({
    'click .newHeroButton': function(){
      $('#newComicForm').css({'z-index': '1000'});
    }
  });
  Template.Home.rendered = function () {
    var bgImgArray = ['marvel.jpg', 'marvel-2.jpg', 'marvel-3.jpg', 'dc-comics.jpg', 'dc-comics-2.jpg', 'dc-comics-3.jpg', 'dc-comics-women.jpg'];
    var randImg = bgImgArray[Math.floor(Math.random() * bgImgArray.length)];
    function returnImg (){
      return randImg
    }
    $('#full-bg img').attr({'src': '/'+returnImg()});
  };
  Template.Publisher.rendered = function () {
    var bgImgArray = ['marvel.jpg', 'marvel-2.jpg', 'marvel-3.jpg', 'dc-comics.jpg', 'dc-comics-2.jpg', 'dc-comics-3.jpg', 'dc-comics-women.jpg'];
    var randImg = bgImgArray[Math.floor(Math.random() * bgImgArray.length)];
    function returnImg (){
      return randImg
    }
    $('#full-bg img').attr({'src': '/'+returnImg()});
  };
  Template.Publisher.helpers({
    hero:function(){
      return Comics.find({});
    }
  });
  Template.Publisher.events({

  });
  Template.Hero.helpers({

  });
  Template.NewComic.events({
    'submit form': function(event){
      event.preventDefault();
      $('.newHeroButton').keyup(function(){
          this.value = this.value.toLowerCase();
      }); 
      var addApps = [];
      var publisherVar = event.target.publisher.value.toLowerCase().replace(' ','');
      var superheroVar = event.target.superhero.value;
      var superheroImg = event.target.heroheadshot.value;
      var coverImage = event.target.coverImage.value;
      var imgDescript = event.target.imgDescript.value;
      //addApps.push(event.target.appearance, $('.add-field').val());
      $('.add-field').each(function(){
        addApps.push($(this).val())
      });
      addApps.push(event.target.appearance.value);
      Comics.insert({
        publisher: publisherVar,
        superhero: superheroVar,
        heroHeadShot: superheroImg,
        coverImage: coverImage,
        imgDescript: imgDescript,
        addApps: addApps
      });
      $('#newComic').modal('hide')
    },
    'click #add-more': function(e){
      e.preventDefault();
      $('#add-more').before('<b class="faux-label">Appearance: </b><input class="inputField add-field" style="float: left; position: relative" type="text"/>');
    },
    'blur input': function(event){
      if(event.target.value===''){
        $(event.target).next('span').show();
      }
    },
    'focus input': function(event){
      $(event.target).next('span').hide();
    }
  });

/*  Template.popUpForm.events({
    'click button.close': function(){
      $('#newComic').modal('hide');
      $('input.inputField').each(function(){
        $(this).val('');
      });
    } 
  });*/
}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish("comics", function(){
    return Comics.find();
  });
  Meteor.publish("publishers",function(thisPublisher){
    return Comics.find({publisher: thisPublisher});
  });
  Meteor.publish('all-volumes', function(thisHero){
    return Comics.find({superhero: thisHero});
  });
}
Router.route('/', {
  name: 'home',
  waitOn: function(){
    return Meteor.subscribe("comics");
  }, 
  data: function(){
    return Comics.find();
  },
  action: function(){
    if(this.ready()){
      this.render("Home")
    }
  }
});
Router.route('/:publisher',{
  name: "publisher",
  waitOn: function(){
    return Meteor.subscribe("publishers", this.params.publisher);
  },
  data: function(){
    return Comics.find();
  },
  action: function(){
    if(this.ready()){
      this.render("Publisher");
    }
    else{
      console.log("loading");
    }
  }
});
Router.route('/:publisher/:superhero',{
  name: "superhero",
  waitOn: function(){
    return Meteor.subscribe("comics");
  },
  data: function(){
    return Comics.findOne({superhero: this.params.superhero});
  },
  action: function(){
    if(this.ready()){
      this.render("Hero");
    }
    else{
      console.log("loading");
    }
  }
});
Router.route('/:publisher/:superhero/:volnumb',{
  name: 'volume',
  waitOn: function(){
    return Meteor.subscribe("comics");
  },
  data: function(){
    return Comics.findOne({});
  }
});