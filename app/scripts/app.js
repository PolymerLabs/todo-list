/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  // This is a good place to do initialization work
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');

    // Create a connection to the Firebase database
    this.ref = new Firebase('https://polymer-todo.firebaseio.com/robdodson');

    // Listen for realtime changes
    // This will be called any time state is changed in Firebase and
    // will typically cause the list to rerender. Because most elements
    // in the list remain the same, the dirty checking here is cheap
    // ...or so kevinpschaaf tells me :D
    // This makes Firebase the single source of truth for the app, meaning
    // most/all components are stateless. Which is awesome.
    this.ref.on('value', this.renderTodos.bind(this));
  });

  // Let the user know that offline caching has worked and their
  // app is available offline
  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  app.renderTodos = function(snapshot) {
    // Clear our todos, this is so we can rerender
    // without holding on to state
    // This way Firebase becomes the single source of truth
    this.todos = [];
    snapshot.forEach(function(childSnapshot) {
      var todo = childSnapshot.val();
      // Store a reference to the Firebase object so we can
      // easily remove this todo.
      todo.$id = childSnapshot.key();
      // Use Polymer's push method to add the child
      // to the todos array. This is to notify observers
      this.push('todos', todo);
    }.bind(this));
  };

  app.addTodo = function(e, detail) {
    // Add todo to Firebase
    this.ref.push({
      title: detail.value,
      isComplete: false
    });
  };

  app.removeTodo = function(e, detail) {
    // Find todo by index, then remove from Firebase
    var todo = this.todos[detail.index];
    this.ref.child(todo.$id).remove();
  };

  app.toggleTodo = function(e, detail) {
    // Find todo by index, then update its isComplete value in Firebase
    var todo = this.todos[detail.index];
    this.ref.child(todo.$id).update({isComplete: detail.isComplete});
  };

  app.editTodo = function(e, detail) {
    // Find todo by index, then update its title value in Firebase
    var todo = this.todos[detail.index];
    this.ref.child(todo.$id).update({title: detail.title});
  };

  app.resetTodos = function() {
    // Remove all from Firebase
    this.ref.remove();
  };

})(document);
