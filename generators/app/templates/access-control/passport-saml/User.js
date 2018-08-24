var User = function(profile) {
    this.displayName = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    this.givenName = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
    this.surname = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'];

    // User can hold multiple roles
    let roles = profile['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    let rolesArray = (new Array()).concat(roles);
    this.roles = rolesArray;
    this.email = profile.email;
  };

  module.exports = User;