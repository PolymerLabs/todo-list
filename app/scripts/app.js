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

  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');

    // Create a connection to the Firebase database
    this.ref = new Firebase('https://polymer-todo.firebaseio.com/robdodson');

    // Listen for realtime changes
    // This will be called any time the state of the firebase is changed
    this.ref.on('value', this.renderTodos.bind(this));
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  app.renderTodos = function(snapshot) {
    console.log('renderTodos');
    // Clear our todos, this is so we can rerender
    // without holding on to state
    this.todos = [];
    snapshot.forEach(function(childSnapshot) {
      var todo = childSnapshot.val();
      // Store a reference to the Firebase object so we can
      // easily remove this todo.
      // TODO: We should do this with a key instead!
      // todo.ref = childSnapshot.ref();
      // Use Polymer's push method to add the child
      // to the todos array. This is to notify observers
      this.push('todos', todo);
    }.bind(this));
  };

  app.addTodo = function(e, detail) {
    // Push to Firebase, causing the lists to rerender
    this.ref.push({
      title: detail.value,
      isComplete: false
    });
  };

  app.removeTodo = function(e, detail) {
    // TODO: Need to find by key, then remove
    // Remove from Firebase, causing the lists to rerender
    // var todo = this.todos[detail.index];
    // todo.ref.remove();
  };

  app.resetTodos = function() {
    // Remove all from Firebase, causing the lists to rerender
    this.ref.remove();
  };

  app.syncTodos = function(e, detail) {
    this.ref.remove();
    // TODO: Possibly DRY up with addTodo method
    detail.todos.forEach(function(todo) {
      console.log(todo);
      this.ref.push({
        title: todo.title,
        isComplete: todo.isComplete
      });
    }.bind(this));
  }

})(document);
