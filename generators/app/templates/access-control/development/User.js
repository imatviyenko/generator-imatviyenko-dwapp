var User = function() {
    this.displayName = 'John Doe';
    this.givenName = 'John';
    this.surname = 'Doe';
    this.email = 'john.doe@company.com';

    // User can hold multiple roles
    this.roles = ['user', 'admin'];
  };

  module.exports = User;