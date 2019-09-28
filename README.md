# source-architect-example
One source code architecture example for developing web-based applications.

## Principal of design
1. Seperation of functionality: backend, frontend and core
2. Business oriented microservices
3. Object oriented programming
4. Backend follows the "Model - Service - Controller" design pattern
5. Frontend follows the component design
6. Reusuable code is prefered

## 1. Seperation of functionality
- backend: refered to API services that is consummed by frontend or external requests
- frontend: services that provide UI/UX of the application, get data from backend only
- core: common utilities and libraries to be consummed by both frontend and backend

## 2. Business oriented microservices
- Seperation of backend services by business domains
- For example: 
    + `service.user` for provinding user authentication and user's data
    + `service.stream` for streamming record signal 
    + `service.report` for creating PDF report from multiple sources
    
## 3. Object oriented programming
- When possible, try to group related functions into an representative class for code clarity
- For example, consider these functions
```typescript
function importModel(configFilePath: string) {}
function trainModel(model, datainputs) {}
function inferData(model, input) {}
```
The above functions can be grouped into this representative class
```typescript
class Model {
  private model;
  constructor(configFilePath: string) {
    this.model = this.importModel(configFilePath);
  }
  private importModel(configFilePath: string) {}
  public train(datainputs) {}
  public infer(datainput) {}
}
```

## 4. Backend follows the "Model - Service - Controller" design pattern
- For complicated microservices, it is beneficial to separate into these 3 layers
- `Model`: define Entities, Objects and Types. For example:
```typescript
interface IUser {
  firstName: string,
  lastName: string,
  email: string
}
class User {
  private string firstName;
  private string lastName;
  private string email;
  
  constructor(email: string) {
    var userData = userService.getByEmail(email);
    this.firstName = userDara.firstName;
    this.lastName = userDara.lastName;
    this.email = email;
  }
  
  public async sendMessage(toEmail: string, message: string) {
    var template = {
      toEmail,
      message,
      fromEmail: this.email,
    }
    return mailingService.sendEmail()
  }
}
```

- `Service`: Contain code for business domain specific logics. For example:
```typescript
class UserService {
  static async register(email: string) {
    checkEmailExist(email);
    registerIntercomEmail(email);
    createUserAccount(email);
    sendEmailActivation(email);
    notifyFriends(email);
  }
}
```

- `Controller`: map services and group of services into API endpoint

## 5. Frontend follows the component design
- Preferably use component-oriented frameworks such as ReactJS, VueJS ...
- If neccessary, allways develop code into components for reusability

## 6. Reusuable code is prefered
- When a block of code or functions is re-used multiple times accross projects, try to develop it into external libs/modules
- For example, see [Athenz](https://github.com/nichealpham/source-architect-example/tree/master/libs/athenz) which is a wrapper module for implementing authorizing services with Yahoo! backend system

# Thank you very much for stopping by.
