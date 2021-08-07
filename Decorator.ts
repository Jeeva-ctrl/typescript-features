/* 

    Decorators are one the most powerful features Typescript has to offer, allowing us to extend the functionality of classes and methods in a clean and declarative fashion

*/

const protectedMethods = [];

function protect(target, propertyKey, descriptor) {
  const originalFunction = descriptor.value;

  descriptor.value = function(request) {
    if (request.token !== '123') {
      console.log('Invalid token', request.token);
    }
    const bindedOriginalFunction = originalFunction.bind(this);
    const result = bindedOriginalFunction(request);
    return result;
  };

  return descriptor;
}
const httpEndpoints = {};

function registerEndpoint(constructor) {
  const className = constructor.name;
  const endpointPath = '/' + className.toLowerCase();
  httpEndpoints[endpointPath] = new constructor();
}

@registerEndpoint
class Families {
  private houses = ['Lannister', 'Targaryen'];
  @protect
  get() {
    return this.houses;
  }
  post(request) {
    this.houses.push(request.body);
  }
}

@registerEndpoint
class Castles {
  private castles = ['Winterfell', 'Casterly Rock'];

  get() {
    return this.castles;
  }
  post(request) {
    this.castles.push(request.body);
  }
}

httpEndpoints['/families'].get({ token: '123' }); // ["Lannister", "Targaryen"]
httpEndpoints['/families'].get({ token: '123s' }); // Uncaught Error: forbiden!
