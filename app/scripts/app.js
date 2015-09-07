/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// (function(document) {
//   'use strict';

  // var FIREBASE_APP = 'https://polymer-todo.firebaseio.com';
  //
  // // Grab a reference to our auto-binding template
  // // and give it some initial binding values
  // // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  // var app = document.querySelector('#app');
  //
  // // Listen for template bound event to know when bindings
  // // have resolved and content has been stamped to the page
  // // This is a good place to do initialization work
  // app.addEventListener('dom-change', function() {
  //   console.log('Our app is ready to rock!');
  //
  //   // Listen for todo-list changes
  //   document.addEventListener('todo-item-edited', this.editTodo.bind(this));
  //   document.addEventListener('todo-item-checked-toggled', this.toggleTodo.bind(this));
  //   document.addEventListener('todo-item-deleted', this.removeTodo.bind(this));
  //
  //   // Create a connection to the Firebase database
  //   this.ref = new Firebase(FIREBASE_APP);
  //
  //   // Listen for user sign in
  //   this.addEventListener('user-signed-in', this.handleUserSignIn.bind(this));
  //
  //   // Check to see if the user is already signed in
  //   var authData = this.ref.getAuth();
  //   if (authData) {
  //     console.log('Authenticated user with uid:', authData.uid);
  //     this.fire('user-signed-in', {authData: authData});
  //   } else {
  //     console.log('User is not logged in');
  //     // Show sign in screen
  //     this.$.signInDialog.open();
  //   }
  // });
  //
  // app.signIn = function() {
  //   this.ref.authWithOAuthPopup('google', function(error, authData) {
  //     if (error) {
  //       console.log('Login Failed!', error);
  //     } else {
  //       console.log('Authenticated user with uid:', authData.uid);
  //       this.$.signInDialog.close();
  //       this.fire('user-signed-in', {authData: authData});
  //     }
  //   }.bind(this));
  // };
  //
  // app.signOut = function() {
  //   // this.ref.unauth();
  //   // console.log('User has signed out');
  // };
  //
  // app.handleUserSignIn = function(e) {
  //   var authData = e.detail.authData;
  //   // Get their todo list
  //   this.userRef = this.getAuthenticatedUserRef(this.ref, authData.uid);
  //   // Listen for changes
  //   this.listenForFirebaseChanges(this.userRef);
  // };
  //
  // app.getAuthenticatedUserRef = function(ref, uid) {
  //   return ref.child('users/' + uid);
  // };
  //
  // // Listen for realtime changes
  // app.listenForFirebaseChanges = function(userRef) {
  //   // This will be called any time state is changed in Firebase and
  //   // will typically cause the list to rerender. Because most elements
  //   // in the list remain the same, the dirty checking here is cheap
  //   // ...or so kevinpschaaf tells me :D
  //   // This makes Firebase the single source of truth for the app, meaning
  //   // most/all components are pretty stateless. Which is awesome.
  //   userRef.on('value', this.renderTodos.bind(this));
  // };
  //
  // app.renderTodos = function(snapshot) {
  //   // Clear our todos, this is so we can rerender
  //   // without holding on to state
  //   // This way Firebase becomes the single source of truth
  //   this.todos = [];
  //   snapshot.forEach(function(childSnapshot) {
  //     var todo = childSnapshot.val();
  //     // Store a reference to the Firebase object so we can
  //     // easily remove this todo.
  //     todo.uid = childSnapshot.key();
  //     // Use Polymer's push method to add the child
  //     // to the todos array. This is to notify observers
  //     this.push('todos', todo);
  //   }.bind(this));
  //   // Backup todos to localstorage
  //   this.backupTodos = this.todos.slice();
  // };
  //
  // // Backfill todos from localstorage when the app first boots up
  // app.backfillTodos = function() {
  //   this.todos = this.backupTodos.slice();
  // };
  //
  // // If the app starts up with no todos in localstorage, let's generate
  // // some fake ones for the user
  // app.createDefaultTodos = function() {
  //   this.todos = [
  //     {
  //       label: 'Write your first todo!',
  //       isComplete: false
  //     },
  //     {
  //       label: 'Go watch some Polycasts',
  //       isComplete: false
  //     },
  //     {
  //       label: 'Check out Polymer Starter Kit',
  //       isComplete: false
  //     }
  //   ];
  // };
  //
  // // Add todo to Firebase
  // app.addTodo = function(e, detail) {
  //   this.userRef.push({
  //     label: detail.value,
  //     isComplete: false
  //   });
  // };
  //
  // // Remove todo from Firebase usings its unique ID
  // app.removeTodo = function(e) {
  //   var uid = e.detail.uid;
  //   if (uid) {
  //     this.userRef.child(uid).remove();
  //   } else {
  //     throw new Error('Could not find todo with uid ' + uid);
  //   }
  // };
  //
  // // Toggle isComplete state of todo in Firebase using its unique ID
  // app.toggleTodo = function(e) {
  //   var uid = e.detail.uid;
  //   var isComplete = e.detail.isComplete;
  //   if (uid) {
  //     this.userRef.child(uid).update({isComplete: isComplete});
  //   } else {
  //     throw new Error('Could not find todo with uid ' + uid);
  //   }
  // };
  //
  // // Find todo by index, then update its label value in Firebase
  // app.editTodo = function(e) {
  //   var uid = e.detail.uid;
  //   var label = e.detail.label;
  //   if (uid) {
  //     this.userRef.child(uid).update({label: label});
  //   } else {
  //     throw new Error('Could not find todo with uid ' + uid);
  //   }
  // };
  //
  // // Remove all completed todos from Firebase
  // // TODO: Is this the most efficient way to do this or does Firebase
  // // support some kind of bulk delete?
  // app.clearCompletedTodos = function() {
  //   this.todos.forEach(function(todo) {
  //     if (todo.isComplete) {
  //       this.userRef.child(todo.uid).remove();
  //     }
  //   }.bind(this));
  // };
  //
  // // Let the user know that offline caching has worked and their
  // // app is available offline
  // app.displayInstalledToast = function() {
  //   document.querySelector('#caching-complete').show();
  // };
  //
  // // Close drawer after menu item is selected if drawerPanel is narrow
  // app.onMenuSelect = function() {
  //   var drawerPanel = document.querySelector('#paperDrawerPanel');
  //   if (drawerPanel.narrow) {
  //     drawerPanel.closeDrawer();
  //   }
  // };

// })(document);
