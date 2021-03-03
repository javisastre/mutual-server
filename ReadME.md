# M3 - `README.md`

<br>

# Mutual

<br>

- A social network to send real-time warnings to a secure group of known people whenever you feel in danger. 

## Description

- A web app in which you can sign up and join groups of support in which you can send and receive alerts from other members.
- You can create and join nets, which are groups of users. 
- When you are in a net, you get a screen with a big red button.
- If you click it, the app will get your geolocation and send an alert (via mail or websocket, to be decided) to all members in your net/nets so they know you are in danger and can help you (phone you, go there, warn the police, etc)
- It will also create a pin on a map.
- Next, you will ge the info of the current alert and two buttons: cancel and deactivate.
  - If you click on cancel, the alert gets deleted and your nets get another notification
  - If you click on deactivate, you get a form with 3 fields:
    - Do you want to make the alert public? If you click no, the alert gets deleted
    - If you click yes, you get 3 more options
      - A Dropdown to specify type of alert.
      - A textarea to explain your story.
- In the NavBar, you have an icon with the number of active alerts, as well as a burguer icon that shows a modal with links to: current alert list, historic map of alerts, net management and logout
  - Current alert list: a page with a list of alerts with a button that links to map with a pins of the alert
  - Heatmap: map with pins of all alerts in the database, so you can see the most dangerous areas
  - Net management 
    - Can see a list of  your nets
    - Can leave nets
    - Create new nets
- In the net creationg page, you can give a name and a safety password so others can join.
- In the join net page, you have to input name and net password.



## User Stories

-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
-  **Signup:** As an anon I can sign up in the platform so that I can start playing into competition
-  **Login:** As a user I can login to the platform
-  **Logout:** As a user I can logout from the platform
-  **Create a net** As a user I can create a group
-  **Join a net** As a user I can join an existing net if I have their own inner password
-  **Send an alert** As a user I can sent an alert to the people in my nets
-  **Deactivate alerts** As a user I can deactivate any alert I have sent
-  **Heatmap** As a user I want to see all alerts stored in the database printed on a map
-  **Edit Nets** As a user I can edit my email and get out of any Net I want



# Client / Frontend

## React Router Routes (React App)
| Path            | Component                                                    | Permissions                                | Behavior                                                     |
| --------------- | ------------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------ |
| `/`             | SplashPage                                                   | public `<Route>`                           | Home page                                                    |
| `/signup`       | SignupPage                                                   | anon only  `<AnonRoute>`                   | Signup form, link to login, navigate to homepage after signup |
| `/login`        | LoginPage                                                    | anon only `<AnonRoute>`                    | Login form, link to signup, navigate to homepage after login |
| `/`             | Create or Join a net page                                    | user only `<PrivateRoute>`                 | Shows links to create or join a net                          |
| `/nets/add`     | Create a net                                                 | user only `<PrivateRoute>`                 | Creates a net. Redirects to alert page                       |
| `/nets/join`    | Join a net                                                   | user only `<PrivateRoute>`                 | Joins a net. Redirects to alert page                         |
| `/alert`        | List of active alerts                                        | user only in a net or more`<PrivateRoute>` | Show the list of current alerts                              |
| `/alert/:id`    | Detail of alert                                              | user only in a net or more`<PrivateRoute>` | Shows the alert on a map                                     |
| `/`             | MainPage (button)                                            | user only in a net or more`<PrivateRoute>` | Creates an alert or shows status of sent alert               |
| `/alertactive`  | Show info on the current alert and 2 buttons: cancel & finish | user only in a net or more`<PrivateRoute>` | Shows status of current alert                                |
| `/alertfinised` | Form post alert to get info about it                         | user only `<PrivateRoute>`                 | Show a form with about the alert:<br />- Public or not?<br />- Type of alert (dropdown)<br />- Comment/Story |
| `/heatmap`      | Heat Map                                                     | user only  `<PrivateRoute>`                | List of alerts in a map                                      |
| `/:userid`      | User's nets                                                  | user only `<PrivateRoute>`                 | Edit info or leave nets                                      |



## Components & Pages

### Pages

- Landing Page

- Login Page

- Signup Page

- Alert List

- Single Alert Map

- Net Management

- Heatmap

  

### Components

- Navbar

- Alert Button

- 2 field forms

- Lists

  


## Services

- Auth Service
  - auth.login(user)
  
  - auth.signup(user)
  
  - auth.logout()
  
  - auth.me()
  
    
  
- Net Service

  - Net.list()
  - Net.detail(id)
  - Net.add(id)

    

- Alert Service 

  - Alert.add(id)
  - Alert.edit(id)



<br>


# Server / Backend





## Database Models

- 3 models: **user**, **net** and **alert**.

```javascript
User = {
  id:
  name: {type: String, unique:true, required: true},
  mail: {type: String, unique:true, required: true},
  password: {type: String, required: true},
  yourNets: {type: Array}
  notification_active: {type: mongoose.Schema.Types, ref: 'Alert'}
}

Net = {
  id:
  name: {type: String, unique:true, required: true},
  memebers: {type: Array, ObjectId }
  code: {type: String, unique:true }
  members: {type: Array, ObjectId, ref: 'UserId' }
  alerts: {type: Array, ObjectId, ref: 'Alert'}
}

Alert = {
  id:
  person: {type: mongoose.Schema.Types, ref: 'User'},
  active: {type: boolean, default: true}
  location: [lat, long]
  public: {type: boolean, default: false}
  reason: {type: string default: undefined}
  story: {type: string}
  joined: moment.() ---
  },
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }, --> moment library! npm install 
```

## API Endpoints (backend routes)

| HTTP Method | URL                         | Request Body                 | Success status | Error Status | Description                                                  |
| ----------- | --------------------------- | ---------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| GET | `/auth/profile` | Saved session | 200 (ok) | 404 (not found) | Check if user is logged in and return profile |
| POST        | `/auth/signup`                | {name, email, password}      | 201 (created)  | 404 (not found) | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`                 | {username, password}         | 200 (ok)       | 401 (unauthorized) | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| POST        | `/auth/logout`                | (empty)                      | 204 (no content) | 400 (bad request) | Logs out the user                                            |
|  |  |  |  |  |  |
| GET | `/user/:userId` | Saved session | 200 (ok) | 404 (bad request) | Check if user is logged in.<br />User.find( {id} )<br />Populate Nets<br />Populate Alerts |
|  |  |                                                             |  |  |  |
| PUT | `/net/:netid/leave` | Saved session, {.params.netId} | 200 (ok) | 400 (bad request) | Remove user from net<br />Net.findById( {id} )<br />const { members } = Net<br />Net.filter(user)<br /><br /> |
| DELETE | `/net/:netid/delete` | {params.netId} | 204 (delete ok) | 400 (bad request) | If user leaves and net.members === 0, <br />Net.findByIdAndDelete({}) |
| GET | `/net/join` | {name, code} | 200 (ok) | 404 (not found) | Check if data from form is correct and Net.findOne( {name, code} ) |
| PUT | `/net/:netid/join` | Saved session | 200 (ok) | 400 (not found) | Add user to net.<br />Net.findOneAndUpdate({name, code}, $push{user})<br /> |
| POST | `/net/create` | {name, code} | 201 (Created) | 404 (bad request) | Create net<br />Net.create({name, code}) |
|             |                       |                                                             |                  |                    |  |
| POST        | `/alert/create`       | {userId, location}                                          | 201 (Created)    | 404 (bad request)  | Create alert |
| DELETE      | `/alert/delete/:id`   | {alertId}                                                   | 200 (ok)         | 404 (bad request)  | Delete the alert if user clicks cancel, or sets to non public in form |
| PUT         | `/alert/iamfine/:id`  | {alertId}                                                   | 200 (ok)         | 404 (bad request)  | Update the alert from active: true to active: false. Redirects to Finished alert form |
| PUT         | `/alert/archive/:id/` | {alertId},<br />body = {<br />form.values<br />type, story} | 200 (ok)         | 404 (bad req)      | Alert.findByIdAndUpdate({id})<br /><br />Alert.public: true<br />Alert.type: "string"<br />Alert.story:"string" |
| GET         | `/alert/:id`          | {alertId}                                                   | 200 (ok)         | 404 (bad req)      | Find id in database. If active, frontend will put it on map |
|             |                       |                                                             |                  |                    |  |
| GET         | `/heatmap`            |                                                             | 200 (ok)         | 404 (bad req)      | Find all alerts in db, filter them by alert.type and frontend will show them on map |



<br>


## Links

### Trello

[Link to your trello board](https://trello.com/b/4eRZtn2j/m3project) 

### Git

The url to your repository and to your deployed project

[Client repository Link]()

[Server repository Link](https://github.com/screeeen/project-server)

[Deployed App Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)



