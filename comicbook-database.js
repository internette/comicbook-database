Publishers = new Mongo.Collection('publishers');
Heroes = new Mongo.Collection('heroes');
Volumes = new Mongo.Collection('volumes');
UserVolumes = new Mongo.Collection('user-volumes');
var userArray = [];
if (Meteor.isClient) {
  Template.Home.helpers({
    publishers: function(){
      var makeIntoArray = Publishers.find().fetch();
      var uniqueArray = _.uniq(makeIntoArray, false, function(e){return e.publisher});
      return uniqueArray;
    }
  });
  Template.userChoices.events({
    'click #signup-btn': function(){
      $('#signUpForm').css({'z-index': '2000'});
    },
    'click #login-btn': function(){
      $('#logInForm').css({'z-index': '2000'});
    },
    'click #logout-btn': function(){
      $('#logOutForm').css({'z-index': '2000'});
    }
  });
  Template.Home.events({
    'click .newHeroButton': function(){
      $('#newPublisherForm').css({'z-index': '2000'});
    },
    'mouseenter li': function(){
      $('#full-bg').css({'background':'url('+Publishers.findOne({_id: this._id}).publisherImg+')', 'background-size': 'cover', 'background-position': 'center'});
    },
    'mouseleave li': function(){
      $('#full-bg').css({'background':'gainsboro'});
    }
  });
  Template.Publisher.helpers({
    hero:function(){
      var makeIntoArray = Heroes.find().fetch();
      var uniqueArray = _.uniq(makeIntoArray, false, function(e){return e.heroName});
      return uniqueArray;
    }
  });
  Template.Publisher.events({
    'mouseenter li': function(){
      $('#full-bg').css({'background':'url('+Heroes.findOne({_id: this._id}).heroImg+')', 'background-size': 'cover', 'background-position': 'top center'});
    },
    'mouseleave li': function(){
      $('#full-bg').css({'background':'gainsboro'});
    },
    'click .newHeroButton': function(){
      $('#newHeroForm').css({'z-index': '2000'});
    }
  });
  Template.NewPublisher.events({
    'submit form': function(event){
      event.preventDefault();
      $('.newHeroButton').keyup(function(){
          this.value = this.value.toLowerCase();
      }); 
      var publisherVar = event.target.publisher.value.toLowerCase().replace(' ','');
      var publisherImage = event.target.publisherimg.value;
      if(Heroes.find({publisher: publisherVar}).count()>=1){
        alert('this already exists');
      } else{      
        Publishers.insert({
        publisher: publisherVar,
        publisherImg: publisherImage
      });}
      $('#newPublisherForm').modal('hide')
    },
    'blur input': function(event){
      if(event.target.value===''){
        $(event.target).next('span').show();
      }
    },
    'focus input': function(event){
      $(event.target).next('span').hide();
    },
    "click a.close": function(e){
      e.preventDefault();
      $('form').modal('hide');
    }
  });
  Template.NewHero.events({
    'submit form': function(event){
      event.preventDefault();
      $('.newHeroButton').keyup(function(){
          this.value = this.value.toLowerCase();
      }); 
      var publisherVar = window.location.href.split('/')[3];
      var heroName = event.target.superhero.value.toLowerCase();
      var heroImg = event.target.superheroimg.value;
      var heroDetails = event.target.herodetails.value;
      var heroRealName = event.target.herorealname.value;
      if(Heroes.find({heroName: heroName}).count()===1){
        alert('this already exists');
      } else{
        Heroes.insert({
          publisher: publisherVar,
          heroName: heroName,
          heroImg: heroImg,
          heroRealName: heroRealName,
          heroDetails: heroDetails
        });
      }
      $('#newHeroForm').modal('hide');
    },
    'blur input': function(event){
      if(event.target.value===''){
        $(event.target).next('span').show();
      }
    },
    'focus input': function(event){
      $(event.target).next('span').hide();
    },    
    "click a.close": function(e){
      e.preventDefault();
      $('form').modal('hide');
    }
  });
Template.AllVolumes.helpers({
  volumes: function(){
    return Volumes.find();
  }
});
Template.UserDetails.helpers({
  volumes: function(){
    return Meteor.user().comics
  }
});
  Template.AllVolumes.events({
    'submit form': function(event){
      event.preventDefault();
      $('.newHeroButton').keyup(function(){
          this.value = this.value.toLowerCase();
      }); 
      var publisherVar = window.location.href.split('/')[3];
      var heroName = window.location.href.split('/')[4];
      var appearanceName = event.target.appearanceName.value;
      var volNo = event.target.volNo.value;
      var coverart = event.target.coverart.value;
      var synopsis = event.target.synopsis.value;
      if((Volumes.find({appearanceName: appearanceName, heroName: heroName}).count()>=1)){
        alert('this already exists');
      } else{
        Volumes.insert({
          publisher: publisherVar,
          heroName: heroName,
          appearanceName: appearanceName,
          volNo: volNo,
          coverart: coverart,
          synopsis: synopsis,
          owned: false
        });
      }
      $('#newAppearanceForm').modal('hide');
    },
    'mouseenter li': function(){
      $('#full-bg').css({'background':'url('+Volumes.findOne({_id: this._id}).coverart+')', 'background-size': 'cover', 'background-position': 'center'});
    },
    'mouseleave li': function(){
      $('#full-bg').css({'background':'gainsboro'});
    },
    'blur input': function(event){
      if(event.target.value===''){
        $(event.target).next('span').show();
      }
    },
    'focus input': function(event){
      $(event.target).next('span').hide();
    },  
    "click a.close": function(e){
      e.preventDefault();
      $('form').modal('hide');
    },
    "click a.is-it-owned": function(event){
      event.preventDefault();
      if(this.owned===true){
        Meteor.call('removeComic', this._id, this.appearanceName, this.volNo, function(error, user){console.log(user.comics)});
        Volumes.update(this._id,{$set:{owned: false}});
      } else {
        Meteor.call('addComic', this._id, this.appearanceName, this.volNo, function(error, user){console.log(user.comics)});
        Volumes.update(this._id, {$set:{owned: true}});
      }
    },
  });
  Template.signup.events({
    "submit #signUpForm": function(e,t){
      e.preventDefault();
      var username = e.target.username.value;
      var password = e.target.password.value;
      var email = e.target.email.value;
      Accounts.createUser({
        username: username,
        password: password,
        email: email,
        comics: []
      }, function(err){
        if(err){
          console.log('You are not logged in');
        
      } else {
        $('#signUpForm').modal('hide');
      }

    });
   },
    'blur input': function(event){
      if(event.target.value===''){
        $(event.target).next('span').show();
      }
    },
    'focus input': function(event){
      $(event.target).next('span').hide();
    },
    "click a.close": function(){
      $('#signUpForm').modal('hide');
    }
 });
    Template.login.events({
    "submit #logInForm": function(e,t){
      e.preventDefault();
      var unam = e.target.username.value;
      var password = e.target.password.value;
      Meteor.loginWithPassword(unam,password,function(err){
        if(err){
          alert("Wrong Credentials");
        } else {
          $('#logInForm').modal('hide');
        }
      });
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
  Template.logout.events({
    "submit #logOutForm": function(e,t){
      e.preventDefault();
      Meteor.logout(function(err){
        if (err){
          alert("Unable to logout");
        }
        else{
          $('#logOutForm').modal('hide');
        }
      });
    },
    "click .cancel": function(e){
      e.preventDefault();
      $('#logOutForm').modal('hide');
    }
  });
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
Meteor.methods({
  addComic: function(id, title, volume){
    Meteor.users.update(Meteor.userId(),{$addToSet: {comics: [id, title, volume]}});
    return Meteor.user();
  },
  removeComic: function(id, title, volume){
    Meteor.users.update(Meteor.userId(), {$pull: {comics: [id, title, volume]}});
    return Meteor.user();
  }
});
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish("heroes",function(thisPublisher){
    return Heroes.find({publisher: thisPublisher});
  });
  Meteor.publish("publishers",function(){
    return Publishers.find();
  });
  Meteor.publish('all-volumes', function(thisHero){
    return Volumes.find({heroName: thisHero});
  });
  Meteor.publish('this-vol', function(thisHero){
    return Volumes.find({heroName: thisHero});
  });
  Meteor.publish('user-owned', function(){
    return UserVolumes.find();
  });
  Meteor.publish('userByUsername', function(username){
    return Meteor.users.find({username:username});
    return UserVolumes.find({username: username});
  });
  Accounts.onCreateUser(function(options,user){
    user.comics = [];
    return user;
  });
}
Router.route('/', {
  name: 'home',
  waitOn: function(){
    return Meteor.subscribe("publishers");
  }, 
  data: function(){
    return Publishers.find();
  },
  action: function(){
    if(this.ready()){
      this.render("Home")
    }
  }
});
Router.route('/user/:username', function(){
  this.wait(Meteor.subscribe('userByUsername',this.params.username));
  if (this.ready()){
    this.render('UserDetails', {
      data: function(){
        return Meteor.users.findOne({username: this.params.username});
      }
    });
  }
});
Router.route('/signup',{
  action: function(){
    this.render('signup')
  }
});
Router.route('/login',{
  action: function(){
    this.render('login')
  }
});
Router.route('/logout',{
  action: function(){
    this.render('logout')
  }
});
Router.route('/:publisher',{
  name: "publisher",
  waitOn: function(){
    return Meteor.subscribe("heroes", this.params.publisher);
  },
  data: function(){
    return Heroes.find();
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
Router.route('/:publisher/:heroName',{
  name: "heroName",
  waitOn: function(){
    return Meteor.subscribe("heroes", this.params.publisher);
  },
  data: function(){
    return Heroes.findOne({heroName: this.params.heroName});
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
Router.route('/:publisher/:heroName/all-volumes',{
  name: 'all-volumes',
  waitOn: function(){
    return Meteor.subscribe("all-volumes", this.params.heroName);
  },
  data: function(){
    return Volumes.findOne({});
  },
  action: function(){
    if(this.ready()){
      this.render("AllVolumes");
    }
    else{
      console.log("loading");
    }
  }
});
Router.route('/:publisher/:heroName/:volNo',{
  name: 'volumeDetails',
  waitOn: function(){
    return Meteor.subscribe("this-vol", this.params.heroName, this.params.volNo);
  },
  data: function(){
    return Volumes.findOne({volNo: this.params.volNo});
  },
  action: function(){
    if(this.ready()){
      this.render("volume-details");
    }
    else{
      console.log("loading");
    }
  }
});