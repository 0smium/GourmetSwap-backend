# Gourmet Swap Documentation

***Connecting everyone with great food cooked with love!***

## General Description
Gourmet Swap is an online platform for connecting local chefs and their neighbors for a varierty of culinary services from preparation of nutritious home-cooked meals to cooking classes to catering.  Often our days are filled with work, kids and events leaving little time for healthy eating.  Gourmet Swap offers a convenient, healthier alternative to fast food and take-out.  Users browse meals and services available in their neighborhoods and can place orders for pickup and delivery.

## Technical Description
Gourmet Swap lives on the MERN stack.  The React front-end is server agnostic and relies on an independent RESTful API back-end utilizing the Express web application framework on Node.JS with the MongoDB NoSQL database server.  The MERN stack is highly scalable within the context of Platform as a Service (PaaS) providers, such as Heroku where both the front-end and back-end are currently deployed.  Much of the static content is provided via the AWS S3 content delivery network.

### Technical Documentation

#### Front-end

##### Views
- The views are handled in a component architecture.

##### Redux
 - Redux.js is a predictable state container that requires *actions* (plain objects) to be dispatched in order to change the application state.  The state cannot be modified directly.  This provides predictability, i.e. the same actions in the same order will produce the same results.

#### Back-end

##### RESTful API Routes – All data is returned as JSON

**POST /api/signup (creates a new user)**
- **Requires** an application/json body with email and password key/value pairs
- **Returns** a cookie to the browser with a user token and sends status 201 and a token as the response body

GET /api/signin (for the purposes of login)
- **Requires** an email and password sent over basic auth
- **Returns** a cookie to the browser with a user token and sends status 201 and a token as the response body.

GET /api/users/auth
- **Requires** bearer auth
- **Returns** a boolean value (whether user is a cook or not)

GET /oauth/google/code
- Accepts a GET request from the Google OAuth 2.0 API with a query code
- Sends a POST request with form-data including the query code, grant_type, client_id, client_secret, and redirect_uri tot he Goodle Oauth API
- Takes the POST response-data (a Google OAuth token) and sends a GET request with bearer auth token to the Google Plus API
- A Google Plus profile is returned and used to either create a new user or log in an existing user.

PUT /api/users
- **Requires** bearer auth and one or more user model key/value pairs to update as either application/json or form-data.
- **Returns** the updated object.

POST /api/profiles
- **Requires** bearer auth and a form-data body with all required profile model key/value pairs with an optional photo.
- The photo is processed by S3 middleware where it is uploaded to an S3 bucket and a URL is returned.
- **Returns** a profile object including a URL to the uploaded photo.

PUT /api/profiles/:id
- **Requires** bearer auth and one or more profile model key/value pairs to update as form-data.  This route’s logic finds the correct profile by the bearer auth token.
- A new photo can be added which replaces any existing photoURL in the profile object
- **Returns** a profile object including a URL to the uploaded photo.

GET /api/profiles/:id
- **Requires** bearer auth.  This route’s logic finds the correct profile by the bearer auth token.
- **Returns** a profile object.

POST /api/cooks
- **Requires** bearer auth and an application/json or form-data body with all required cook model key/value pairs.
- The associated user model is updated with a cook boolean set to true
- **Returns** a cook object.

PUT /api/cooks/:id
- **Requires** bearer auth and one or more cook model key/value pairs to update as form-data or application/json.  This route’s logic finds the correct cook profile by the bearer auth token.
- **Returns** a cook object.

GET /api/cooks/:id
- **Requires** bearer auth.  This route’s logic finds the correct cook profile by the bearer auth token.
- **Returns** a cook object

POST /api/meals
- **Requires** bearer auth and a form-data body with all required meal model key/value pairs with an optional photo.
- The photo is processed by S3 middleware where it is uploaded to an S3 bucket and a URL is returned.  The cook’s meal array is updated with the new meal object’s ID.
- **Returns** a meal object including a URL to the uploaded photo.

PUT /api/meals/:id
- **Requires** bearer auth and one or more meal model key/value pairs to update as form-data.  This route’s logic uses the meal ID appended to the end of the route to locate the correct meal object.
- A new photo can be added which replaces any existing photoURL in the profile object
- **Returns** a meal object including a URL to the uploaded photo.

GET /api/meals/:id
- **Requires** the meal ID to be appended to the end of the route to locate the correct meal object.
- **Returns** a meal object’s

GET /api/meals
- **Requires** a simple GET request without authentication and optional query strings of page=[page number], sortBy=[meal model property], sortType[-1 for descending or 1 for ascending]
- **Returns** paginated meal objects of 50 per page.

GET /api//meals/where/equals
- **Requires** a simple GET request without authentication and required and optional query strings
  - Optional: page=[page number], sortBy=[meal model property key], sortType[-1 for descending or 1 for ascending]
  - Required: where=[meal model property key], equals=[value associated with key passed in to ‘where’]
- **Returns** paginated meal objects of 50 per page.

##### MongoDB Models
- **User**
  - email (string)
  - passwordHash (string)
  - tokenSeed (string)
  - profile (reference to profile ID)
  - cook (boolean: is this user a cook)
- **Profile**
  - userId (reference to the userId that owns the profile)
  - firstName (string)
  - lastName (string)
  - streetAddress (string)
  - city (string)
  - state (string)
  - zip (string)
  - phone (string)
  - wantsToBeCook (boolean)
  - isCook (boolean)
- **Cook**
  - approved (boolean)
  - signatureDishes (string)
  - restaurantsCookedIn (number)
  - bestDescribes (string)
  - mealsPerWeek
  - services
  - cuisines
  - offerDelivery
  - userId (reference to the userId that owns the cook profile)
  - meals (array of meal object IDs)
  - community (string)
  - hoursPerWeek (number)
  - moreInfo (string)
  - howDidYouHear (string)
- **Meal**
  - userId (reference to the userId that created the meal object)
  - title (string)
  - cuisines (string)
  - description (string)
  - pickupOffered (boolean)
  - deliveryOffered (boolean)
  - portions (number)
  - photoURL (string)
  - ingredients (string)
  - startDate (ISO Date)
  - endDate (ISO Date)
  - location (string)
  - enabled (boolean)
  - price (number)
  - allTimeOrders (number)
- **Transaction -** ***this model is the prototype for transaction tracking and shopping cart functionality not yet implemented***
  - creationDate (ISO Date)
  - customer (userId of customer’s user object)
  - cook (userId of cook’s user object)
  - meals (array of mealIds of meal objects included in the transaction)
  - delivered (boolean)
  - pickedUp (boolean)
  - total (number)
  - status (string: inCart, Paid, Complete)

#### Continuous Integration
Updates to the code base are required to pass Travis CI build and tests.

### Creators
Gourmet Swap started in 2016 with two entrepreneurs, Ezon and Fagner. Ezon is from Seattle, WA. He is the Founder of Gourmet Swap. Fagner is from Brazil, he is a partner of the User experience design team.   They were inspired to start Gourmet Swap by a Facebook group called “San Diego Foodie Fest” with over 20k subscribers that serves as a marketplace for buying and selling home cooked meals.

### Contributors

#### Amanda Koster
Hailing from a strong creative background, I am motivated by the constraints of design and addicted to the wizardry of code. After working with several large companies I found a disconnect between producers, designers, and devs. I became a developer in order to speak both languages and bridge this gap.

#### Matthew Parker
Hi, I'm Matthew Parker! I'm a writer and Full-Stack JavaScript developer. I've pursued both of these passions because I love to create, and with these skills I'm able to imagine a thing, and then write it into existence. I'd rather be doing nothing else!

#### Justin Green
I am a full stack JavaScript developer that loves solving complex problems and learning new technologies. My prior experience in the Army helped me developed skills that allow me to be driven, passionate and determined to get the job done in a timely manner and working proficiently with others in a team setting.

#### Zachary Diehl
An operations leader turned technologist, I plan to use my past experience to develop and lead small development teams to solve real human problems.  Technology is amazing, but it is only as beneficial as the problems it solves for society.

#### Steve Walsh
I bring business and coding experience together to build big things and solve complex problems!  I love working on a team committed to collaboration, success, and mutual growth.  My joys are building RESTful backends and learning new technologies.
