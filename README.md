
# General Assembly Project 3 - Holiday Mates

My third project at General Assembly. It was a group project along with [Ollie Calvey](https://github.com/ollie09cal) and [Essie Karjalainen](https://github.com/EssiKarj). We built a social media site for sharing holidays with friends. It was my first time building a full stack application with CRUD functionality.

 ![screenshot-holidaymates](https://i.imgur.com/WXU1sNN.png)

## Brief

A group project to create a full stack React App using Node.js, MongoDB and Express in 9 days.
## Deployment

The project has been deployed using heroku and is available [here](https://holidaymates.herokuapp.com/).

Log in with the following details to explore the site:

> Email: jonny@email.com
> 
> Password: pass

## Code Installation

* Clone or download the repo

* Change into the ‘backend’ folder: `cd backend`

* Install the back end dependencies: run `yarn`

* Seed the database: run `yarn seed`

* Set up the back end server: run `yarn serve`

* Change into the front end folder: `cd client`

* Install the front end dependencies: run `yarn`

* Start the front end server: run `yarn start`

## Technologies Used

* MongoDB
* Mongoose
* Express
* Node.js
* JSON Web Token
* React
* Chakra
* Axios
* React-Map-GL
* React Bootstrap
* SASS

## Approach Taken

### Planning:

We began by talking through our ideas for projects on zoom before deciding on a social media site for holidays. We then made a trello board and planned out what we wanted to have achieved by the end of each day.

![trello](https://i.imgur.com/O2lCWcw.png)

We planned to work primarily from 9.30 - 5/6 staying on zoom the whole time, so that we could talk through problems immediately and bounce ideas off each other. At the end of each day we decided to write a checklist for what we wanted to achieve the next day on trello.

![daily-checklist](https://i.imgur.com/4kV8euh.png)

We also had a slack channel to share links and update each other for when we worked later in the day. As this was the first time for all of us in building the back end of a project, we decided we would work together on it with one of us sharing their screen. We could then split up the work on the front end.

We made a wireframe of what the front end would look like.

![wireframe](https://i.imgur.com/qfQBMZX.jpg)

We then created a basic back end file structure and linked it to a GitHub repository. As neither Essi or Ollie had used version control with GitHub before we went through the process a few times with updating the README and fixing merge conflicts.

We then wrote the pseudocode for all the functions and components we would need for both the back and the front end. This made it easier to keep track of who had completed what and what else needed doing.

![pseudocode](https://i.imgur.com/cZ38LqY.png)

### Back End:
We started working together in building the basic structure of the back end, installing the necessary dependencies and setting up the basic middleware necessary to have a server running. We then began to build the different schemas for users, holidays and activities. In the code, the activities are referred to as Holiday Type Cards, however, I will continue to refer to them as activities as I think it makes a clearer distinction to the main holiday model.

As we wanted the search function to be able to search by individual activities such as ‘restaurants’, we wanted the activities associated with the overall holiday to have their own database. This meant we had to create an array of one-to-many reference relationships on the holiday schema for the activities and another relationship on the activity schema referencing the holiday.

![holiday-schema](https://i.imgur.com/cJ4ZwUL.png)

![activity-schema](https://i.imgur.com/FITHaO8.png)

At this point we were able to split up the work. I first worked primarily on the holiday type card controllers. This often involved updating the parent holiday as well. For example the ‘addHolidayTypeCard’ controller involved first creating the activity, and then finding the necessary parent holiday and pushing the activity id to the parent’s ‘holidayTypes’ array.

![add-activity-controller](https://i.imgur.com/zfYnuwm.png)

I achieved this by using the id of the parent holiday in the URL params.

I then moved to working on the adding friends functionality. I began by trying out a Mongoose friends plugin but took a while to get results so decided to make my own controller. 

Essi had the idea of having a token for each user which, if entered by another user, would add them as friends. We liked the idea of having a private aspect to the site so that only your friends could see your profile and holidays to encourage the informal, casual nature of sharing experiences. Having a token system of adding friends, meant that friends could be added without showing a big list of profiles to the public.

I, therefore, made a controller that added the friends, first by taking a username from the `req.body` and then checking if the token in the `req.body` was the same as the token on the user. If it was, then the id of the respective users was added to each user’s friends list.

![add-mate-controller](https://i.imgur.com/awQN1Iu.png)

At this point we planned on having the option of making your profile public if you wanted, so that people who were not friends could view your profile and holidays. I felt that if we went ahead with the public feature, it would be useful to have friend request functionality so I made an alternative way of adding friends for when you did not know the token of the other profile.

This involved adding a ‘matesRequests’ and a ‘requestsSent’ field to the user schema. I then added the necessary controllers to get, send, confirm and delete friend requests. These all involved updating information on both the current user and the user being requested. For example, here is the ‘confirmMatesRequest’ controller.

![confirm-mate-request-controller](https://i.imgur.com/K5q8Hdk.png)

It works by first finding the user who sent the request using the id in URL params. Then it finds the current user by using the `req.currentUser` passed down from the secure route. If successful, it pushes the respective ids into the users’ mates array and splices the id from the ‘requestSent’ or ‘matesRequest’ arrays to remove it.

At this point we worked together to clean up the back end and ensure all the routes were working using Insomnia.

### Seeding
Over the weekend, we decided to work separately and each seed a user and a few holidays ready to start the front end on Monday. I added a function in the seeds.js file which firstly added 3 holidays per user and then 3 activities per holiday.

![seeding-function](https://i.imgur.com/XSh3lA4.png)

This enabled us to have multiple seeded users with a few holidays each so we could easily see the functionality of the site.

I also spent the weekend practising with the react mapbox and looking for API’s that would help in the search feature of the map. Eventually the Mapbox Geocoding API looked like it would be most useful.

### Front End:

We created the basic React app together and connected it to the back end. We also decided to use Chakra as we went so that basic styling could be made as we worked. We then added in the different components and decided how we would split up the work. 

We decided that I would work on the explore and search map, the profile and the mates tiles pages, while Essie worked on the authentication, navigation bar and mates map and Ollie worked on the add, view, update and delete holidays and activities pages.

Although we were working on separate components, we stayed on zoom all day. This meant we could quickly contact each other if we got stuck or needed information on how their component might work with ours. We also went through merge conflicts together to ensure that nothing was lost.

#### Explore Map

The little practice I had done over the weekend with mapbox had only been partially successful and I had struggled to get the full functionality of the map working. As we would all ideally be using some form of the map in our respective components, I created a practice map component, in which we could all have a go at mastering the basic functionality of mapbox without worrying about making a mess in a proper component of the site. 

I started by creating the basic React map which updated the viewport `onChange` saving it to React state. This allowed the user to move the map around interactively.

![react-map](https://i.imgur.com/q9QTKdz.png)

I then created a marker that displayed the users’ current location.

![get-current-location](https://i.imgur.com/pT0mXEB.png)

![current-location-marker](https://i.imgur.com/6y2H6Kp.png)

I then mapped through all the holidays and created markers for them based on the longitude and latitude. Each one was displayed as a Chakra Avatar using the picture from the holiday.

![holiday-markers](https://i.imgur.com/8NQiR73.png)

I wanted the holiday markers to display a preview of the holiday as a popup when clicked. I was struggling to get the React mapbox marker to consistently register clicks, so I wrapped the avatar in a div and gave it an id that was equal to the holiday id. This enabled me to make a ‘handleClick’ function on the div that found the holiday based on the `e.target.id` and added it to a React state called ‘showPopup’.

![show-popup-function](https://i.imgur.com/CUtpJhJ.png)

I then added a Mapbox popup that was displayed when the ‘showPopup’ state had value.

![react-map-popup](https://i.imgur.com/WyxlsmE.png)

This similarly had to be wrapped in a div to handle a click that would take it to Ollie’s view holiday page. I also had to add an onClose function that reset the ‘showPopup’ state to `null` and remove the popup.

#### Search Map

I first created a text input which updated a React state called ‘searchValues’ on change. This meant that the results would come up as the user typed rather than waiting for them to press search.

![text-input](https://i.imgur.com/7j8M0vb.png)

![handle-change-search-bar](https://i.imgur.com/Z30IRSe.png)

This then made a request to the Mapbox Geocoding API which provides a result of 5 locations based on the search values and saved the results to state called ‘resultsOptions’

![geocoding-request](https://i.imgur.com/phI9qt0.png)

These options are then displayed below the search bar with an ‘onClick’ function that finds the longitude and latitude of the clicked option and updates the viewport of the map enabling the user to view their clicked location. It then resets the search and results state to enable a new search.

![display-results-options](https://i.imgur.com/MUnNoiy.png)

![search-click-function](https://i.imgur.com/0GbDz40.png)

#### Profile Pages

Having spent quite a while with mapbox, I decided to move on to the profile pages and come back later to sort out the filter results for the map.

The initial functionality of the profile page was relatively straight forward, I used a `useEffect()` to get the profile data on the first render of the page and then displayed the data using Chakra styling.

![get-profile-data](https://i.imgur.com/maauII0.png)

I moved to the ‘AddMates’ functionality. As I thought this might be useful in other parts of the site I put it into its own component. I decided to use the Modal in Chakra which creates a small popup window when clicked. The modal contained a form which updated state on change and sent an axios request when submitted.

![add-mate-function](https://i.imgur.com/r3jEStK.png)

Whilst this did work, it did not update the profile page until the page was reloaded. I therefore added a ‘listenToChild’ function in the profile page that added 1 to a count in state. Any change to this count triggers the `useEffect` to get the profile information again.

![update-state-on-parent](https://i.imgur.com/CiRvqAZ.png)

It was then quick to create the ‘MatesProfile’ page as it followed much of the same functionality with a few omissions.

I also created a ‘matesTiles’ page which displayed a list of all your mates and their pictures with links to their main profile page.

#### Explore Map Filter

I was now happy to go back to working on the explore map page. I wanted filter options so that users could search by activity.

I created another Chakra Modal and added a form with three checkboxes; ‘searchByHolidayType’, ‘showPublicHolidays’ and ‘showMyHolidays’. 

![display-filter-checkboxes](https://i.imgur.com/TRqSamN.png)

These all had a ‘handleCheckbox’ function which updated the ‘searchValue’ accordingly.

![search-value-state](https://i.imgur.com/1REJE2T.png)

![update-state-from-checkboxes](https://i.imgur.com/JQeOqU7.png)

For the ‘showPublicHolidays’ and ‘showMyHolidays’ I created a `useEffect` which filtered the data based on the owner id and added the filtered data to a React state called ‘filteredData’.

![update-filtered-data](https://i.imgur.com/DFIQy4p.png)

I then added a check to the React mapbox markers to display results from the ‘filteredData’ instead of ‘data’ if there was a value in the state.

![display-filtered-data](https://i.imgur.com/W4BDldR.png)

I then created a new React state called ‘holidayTypeSearch’ which was triggered by the ‘searchByHolidayType’ checkbox. Once triggered, the filter modal displayed several select inputs for the various different types of activity.

![select-options-for-activities](https://i.imgur.com/ll1jnmp.png)

These then made a new call to the back end which displayed all the activities and filtered the results if one item was checked.

![get-activity-data](https://i.imgur.com/iWhWum5.png)


### Styling
At this point we all had completed the functionality of the site along with some basic Chakra styling. We had gone over our initial plan for the front end by an extra morning, but still had enough time to finish the styling.

At first we decided on a set of colours that worked together based on a logo I had made using a generate-logo website. As Ollie had already styled his boxes to a standard we were happy with, we decided to use his Chakra styling for boxes as standard. 

We then moved to style the components we had each been working on. We also decided to style the site for mobile first and add desktop styling later on.

For the explore map, I made the map full page with the search bar above it at the top.

![map-styling](https://i.imgur.com/7pEhw4y.png)

The profile page was styled in a long vertical column in mobile. The background was made by Essi for the home page. 

![profile-styling](https://i.imgur.com/ykA421m.png)

For the desktop view, I split the page in half with the left side fixed, displaying the profile info and mates, and the right side able to scroll through the holidays.

![profile-desktop-styling](https://i.imgur.com/ADx9ZlG.png)

For the mates tiles boxes I created a small piece of control flow that displayed the holiday pictures from the profile in a grid.

![mates-tiles-styling](https://i.imgur.com/PUL0Tdx.png)

When we came to check that all the styling was consistent, we noticed that the search bar was coming in front of the menu options displayed from the navigation bar.

![styling-bug](https://i.imgur.com/73phJ9y.png)

This proved particularly difficult to target and I could not find a way to change the options z-index due to some behind the scenes Chakra styling. After trying a number of fixes, the best solution I found was to add a check in the menu component which looked to see if ‘search’ was included in the url of the page. If so, it added a class of ‘isLower’ which added styling to lower the options to below the search bar.

![check-urls](https://i.imgur.com/9cqQmJ0.png)

![fixed-styling](https://i.imgur.com/xBtxMKV.png)

## Challenges
A big challenge was getting the React Map to function properly. However, by the end I got the hang of manipulating it in the way I wanted.

There were also several hurdles when trying to overwrite the chakra styling. In particular, the z-index of the navigation bar proved very difficult to target..

## Bugs

The popups on both maps can be too large for the screen depending on the size of the photo they contain and the position on the map.

## Wins

We spent a lot of time planning before getting started which definitely saved time in the long run as we did not have to go back to the back end once we started working on the front end.

This was also  the first back end any of us had built and we had made lots of routes that made making calls on the front end relatively straightforward.

## Future Features

There are many features we wanted to add but had to stick to our MVP given the time constraints. These included:

* Public and private accounts and holidays.
* Friend request to public accounts.
* Shared holidays.
* Comments and ratings on other people’s holidays.

##Key Learnings
The biggest thing I learnt on this project was coding in a team. This was the first group project I had worked on. In particular, I learnt the importance of talking through ideas clearly and making sure everyone had a clear vision of what we were talking about and how we would address the issue.


