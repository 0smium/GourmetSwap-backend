### Models

#### User
- id (mongo)
- email
- pw hash
- tokenSeed

#### Basic Profile
- id (mongo)
- userId (user model ref)
- firstName
- lastName
- streetAddress
- city
- state
- zip
- phone
- avatar (url)
- isCook (boolean)

#### Cook Profile
- id (mongo)
- profileId (profile model ref)
- approved (boolean)
- signatureMeals (text)
- restaurantsCookedIn (num)
- bestDescribed (text)
- mealsPerWeek (num)
- services (array: strings)
- cuisines (array: strings)
- offerDelivery (boolean)
- meals (array: meals model ref)
- howBuildCommunity (text)
- hoursPerWeek (num)
- moreInfo (text)
- howDidYourHear (text)

#### Meals
- id (mongo)
- title (text)
- description (text)
- pickup (boolean)
- delivery (boolean)
- portions (num)
- photos (array: URLs)
- ingredients (text)
- startDate (date)
- endDate (date)
- location (object)
- enabled (boolean)
- price (num)

#### Transactions
- id (mongo)
- date (date)
- customer (user id)
- cook (user id)
- meals (2D array: meal id, price, quantity)
- delivered (boolean)
- pickedUp (boolean)
- total
- status (cart, ordered, complete)
