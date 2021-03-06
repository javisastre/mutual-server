# M3 - `README.md`

<br>

# Mutual

<br>

- A social network to send real-time warnings to a secure group of known people whenever you feel in danger.  Specially designed for non privileged social groups.

## Description

- A web app in which you can sign up and join groups of support in which you can send and receive alerts from other members.
- You can create and join `nets`, which are groups of `users`. 
- When you are member of a net, a big red button is available in the main screen.
- By pressing the red button you can create `alerts` that all members in the group will be able to see and track (geo-location).  Then, they will be able to help in their desired way: phone you, go there, warn the police, etc.
- Once you send an `alert`, you get the info of your current alert and two buttons: `cancel` and `I'm OK`.
	- If you click on `cancel`, the alert gets deleted and your nets get de-notified.
	- If you click on `I'm OK`, you get a form with 3 fields:
	  - Would you want to make the alert `public`? If you click no, the alert gets deleted.
	  - If you click yes, you get 2 more options
	    - A dropdown to specify `category` of the discrimination.
	    - A textarea to explain your `story` (optional).
- In the NavBar, you have an icon with the number of active `alerts`, as well as a burguer icon that shows a modal with links to: 'Send Alert', 'Alert List', 'Net List', 'Heatmap' and 'Logout'.
  - Send alert: visit the home page and see the big red button (to send alerts).
  - Alert List: a list of currently active alerts from your nets and see the maps with their locations.
  - Net List: a list of your current nets
  - Heatmap: map with pins of all alerts in the database, so you can see the most dangerous areas
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
  username: {type: String, unique:true, required: true},
  email: {type: String, unique:true, required: true},
  password: {type: String, required: true},
  nets: {type: Array}
  alert: {type: mongoose.Schema.Types, ref: 'Alert'}
}

Net = {
  id:
  name: {type: String, unique:true, required: true},
  code: {type: String, unique:true, required: true}
  members: {type: Array, ObjectId, ref: 'UserId' }
}

Alert = {
  id:
  person: {type: mongoose.Schema.Types, ref: 'User'},
  active: {type: boolean, default: true},
  location: [lat, long],
  publish: {type: boolean, default: false},
  category: {type: [] default: []},
  story: {type: string, }
  },
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
```

## API Endpoints (backend routes)

| HTTP Method | URL                         | Request Body                 | Success status | Error Status | Description                                                  |
| ----------- | --------------------------- | ---------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| GET | `/auth/me | Saved session | 200 (ok) | 404 (not found) | Check if user is logged in and return profile |
| POST        | `/auth/signup`                | {name, email, password}      | 201 (created)  | 404 (not found) | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`                 | {username, password}         | 200 (ok)       | 401 (unauthorized) | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| POST        | `/auth/logout`                | (empty)                      | 204 (no content) | 400 (bad request) | Logs out the user                                            |
|  |  |  |  |  |  |
| POST | `/nets/leave` | Saved session, {.params.netId} | 200 (ok) | 400 (bad request) | Remove user from net<br />Net.findById( {id} )<br />const { members } = Net<br />Net.filter(user)<br /><br />If user leaves and net.members === 0, <br />Net.findByIdAndDelete({}) |
| PUT | `/nets/join` | Saved session | 200 (ok) | 400 (not found) | Check if data from form is correct and Net.findOne( {name, code} )<br />Add user to net.<br />Net.findOneAndUpdate({name, code}, $push{user})<br /> |
| POST | `/nets/create` | {name, code} | 201 (Created) | 404 (bad request) | Create net<br />Net.create({name, code}) |
|             |                       |                                                             |                  |                    |  |
| POST        | `/alerts/create`       | {userId, location}                                          | 201 (Created)    | 404 (bad request)  | Create alert |
| DELETE      | `/alerts/delete/`   | {alertId}                                                   | 200 (ok)         | 404 (bad request)  | Delete the alert if user clicks cancel, or sets to non public in form |
| PUT         | `/alert/iamfine/`  | {alertId}                                                   | 200 (ok)         | 404 (bad request)  | Update the alert from active: true to active: false. Redirects to Finished alert form |
| PUT         | `/alerts/archive/` | {alertId},<br />body = {<br />form.values<br />type, story} | 200 (ok)         | 404 (bad req)      | Alert.findByIdAndUpdate({id})<br /><br />Alert.public: true<br />Alert.type: "string"<br />Alert.story:"string" |
| GET         | `/alerts/active/:id`          | {alertId}                                                   | 200 (ok)         | 404 (bad req)      | Find id in database. If active, frontend will put it on map |
|             |                       |                                                             |                  |                    |  |
| GET         | `/alerts/heatmap`            |                                                             | 200 (ok)         | 404 (bad req)      | Find all alerts in db, filter them by alert.type and frontend will show them on map |
|  |  | |  |  |  |
| GET | `/users/nets` | |  |  | Get data from the user with populated Nets |



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



