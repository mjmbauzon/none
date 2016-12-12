$( document ).ready(function() {
	
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyBYNz3IGt8PS6kZBvN7gbkXMfLC2JekAMI",
		authDomain: "bookrecycle-5b8d1.firebaseapp.com",
		databaseURL: "https://bookrecycle-5b8d1.firebaseio.com",
		storageBucket: "bookrecycle-5b8d1.appspot.com",
		messagingSenderId: "12019208667"
	};
	firebase.initializeApp(config);

	window.history;
	
	//User constructor
	function User(first, last, school, email, phone, user, pass){
		this.firstName = first;
		this.lastName = last;
		this.school = school;
		this.email = email;
		this.phone = phone;
		this.username = user;
		this.pass = pass;
		this.fullName = function(){
			return this.firstName + " " + this.lastName;
		}
	}
	
	var gmuCourses = ["CS100", "CS101", "CS105", "CS112", "CS211", "CS222", "CS262", "CS306", "CS310", "CS321", "CS330", "CS332", "CS367", "CS390", "CS425", "CS450", "CS451", "CS465", "CS469", "CS471", "CS477", "CS480", "CS482", "CS483", "CS484", "CS485", "CS490", "SWE205", "SWE432", "SWE437", "SWE443"];
	var jmuCourses = ["CS112", "CS211", "CS222", "CS262", "SWE432"];
	var uvaCourses = ["CS1010", "CS1110", "CS1111", "CS1112", "CS1113", "CS2102", "CS2110", "CS2150", "CS2910", "CS3102", "CS3205", "CS3240", "CS3330", "CS4102", "CS4414", "CS4457", "CS4457", "CS4501", "CS4630", "CS4710", "CS4720", "CS4740", "CS4750", "CS4753", "CS4810", "CS4970", "CS4980", "CS4993", "CS4998"];
	//map school name to courses provided by the school
	var schoolCourseMap = new Map();
	schoolCourseMap.set("GMU", gmuCourses);
	schoolCourseMap.set("JMU", jmuCourses);
	schoolCourseMap.set("UVA", uvaCourses);

	/**On load of page*/
	window.onload = function(){
		console.log("page loads");
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				// User is signed in here
				console.log('user logged in: ' + user.displayName);
				$('#navBarUser').html('<b>You are signed in as: <u>' + user.displayName + '</u></b>');
				
				//greet user in homepage
				firebase.database().ref("users/" + user.displayName +"/firstName").once('value').then(function(snapshot) {
						var firstname = snapshot.val();
						firebase.database().ref("users/" + user.displayName +"/lastName").once('value').then(function(snapshot) {
							$('#welcomeIndex').html('<b>Welcome '+ firstname + " " + snapshot.val() + '!</b>');
						});
					});
				$('#welcomeIndex').show();
				//display logout tab
				$("#logoutLink").show();
				//display createPosting form
				$("#createPostingForm").show();
				$("#createPostingButton").show();
				$("#createPostingNotSignedInMsg").hide();
				//hide login form
				$("#loginForm").hide();
				$("#loginButton").hide();
				$("#logInSignedInMsg").show();
				//hide create account form
				$("#createAccountForm").hide();
				$("#createAccountButton").hide();
				$("#createAccountSignedInMsg").show();
				//show search user form
				$("#searchUserForm").show();
				$("#searchUserButton").show();
			 } else {
				// No user is signed in here
				console.log('No user is logged in');
				$('#navBarUser').html('You are not logged in. Please sign in!');
				//hide greeting in homepage
				$('#welcomeIndex').hide();
				//hide create posting form
				$("#createPostingForm").hide();
				$("#createPostingButton").hide();
				$("#createPostingNotSignedInMsg").show();
				//dosplay login form
				$("#loginForm").show();
				$("#loginButton").show();
				$("#logInSignedInMsg").hide();
				//display create account form
				$("#createAccountForm").show();
				$("#createAccountButton").show();
				$("#createAccountSignedInMsg").hide();
				//hide search user form
				$("#searchUserForm").hide();
				$("#searchUserButton").hide();
			}
		});
	};
		
	var UserResult = React.createClass({
		render: function(){
			return (<div>
			<br/>
				<p><b><u>Seller Contact Information: </u></b></p>
				<table>
					<tr>
						<th>Seller's First Name</th>
						<th>Seller's Last Name</th>
						<th>Phone Number</th>
						<th>Email</th>
					</tr>
					<tr>
					<td>{this.props.data.firstName}</td>
					<td>{this.props.data.lastName}</td>
					<td>{this.props.data.phone}</td>
					<td><a href="mailto:">{this.props.data.email}</a></td>
					</tr>
				</table></div>
			);
		}
	});

	//React component for the info of every textbook
	class BookRow extends React.Component{
		constructor(){
			super();
			//this.state = {clicked: false};
			this.handleClick = this.handleClick.bind(this);
		}

		handleClick() {
			//this.setState({clicked: !this.state.clicked});
			firebase.database().ref("users/" + this.props.data.sellerID).once('value').then(function(snapshot){
					console.log("User clicked = " + snapshot.val().firstName);
					ReactDOM.render(<UserResult data={snapshot.val()} />, document.getElementById('userInfo'));
				});
		}
		
		render() {
			/*if (this.state.clicked == true){
				firebase.database().ref("users/" + this.props.data.sellerID).once('value').then(function(snapshot){
					console.log("What do we get? " + snapshot.val().firstName);
					ReactDOM.render(<UserResult data={snapshot.val()} />, document.getElementById('userInfo'));
				});
			}*/
					
			
			return (<tr onClick={this.handleClick}>
					<td>{this.props.data.title}</td>
					<td>{this.props.data.author}</td>
					<td>{this.props.data.isbn}</td>
					<td>{this.props.data.sellerID}</td>
					<td>{this.props.data.price}</td>
					<td>{this.props.data.note}</td>
				</tr>		
			);
			
		}
	}

	//React component for all book info under a courseID and school ID
	class BookTable extends React.Component{
		render() {
			console.log("in BookTableClass");
			//take every book info (in JSON format) and return a corresponding BookRow component 
			var bookNodes = this.props.data.map(function(book){
				console.log("this is book " + book.title);
				return (<BookRow data={book}></BookRow>);
			});
			//return all book info (all BookRows) 
			return (<table>
					<thead>
						<tr>
							<th>Textbook Title</th>
							<th>Author</th>
							<th>ISBN</th>
							<th>Seller Username</th>
							<th>Price ($)</th>
							<th>Seller's Notes</th>
						</tr>
					</thead>
					<tbody>
						{bookNodes}
					</tbody>
				</table>);
		}
	
	}

	/**Prints table of postings based on courseID and school */
	function printPostingToTable(courseID, school) {
		//all textbook info under this courseID and schoolID
		var ref = new Firebase("https://bookrecycle-5b8d1.firebaseio.com/school/" + school + "/" + courseID);
		console.log("find data given course school");
		ref.once("value", function(snapshot) {
			//jsonBook is for storing all textbook info under a courseID and school
			var jsonBook = [];
			snapshot.forEach(function(child){
				console.log("in here child unique key is "+child.name());
				jsonBook.push(child.val());
			});
			console.log("this is json " + jsonBook);
			
			if (jsonBook == ""){
				console.log("nothing in jsonBook");
				$('#searchResult').hide();
				$('#noSellerFound').show();
				$("#promptToSearchUser").hide();
			}
			else{
				$('#searchResult').show();
				$('#noSellerFound').hide();
				$("#promptToSearchUser").show();
			}			
			//render all textbook info in a BookTable component
			ReactDOM.render(<BookTable data={jsonBook} />,
					document.getElementById('searchResult'));
			
			$('#spinner').hide();	
			document.getElementById("userInfo").innerHTML = "";
		});
		
	}
	
	/**Updates course options list based on schoolID passed in*/
	function updateCourseOptions(schoolID){
		console.log("modified courseOptions for school " + schoolID);
		var coursesArray = schoolCourseMap.get(schoolID);
		$('#courseOptions').find('option').remove().end().append('<option disabled selected style="color:red">-select-</option>');//.val('whatever');
		for (var course of coursesArray){
			var option = document.createElement("option");
			option.text = course;
			document.getElementById("courseOptions").add(option);
		}
	}
	
	/**When school options dropdown selection is changed, update course options*/
	$("#schoolOptions").change(function() {
		var selectedSchoolVal = $('#schoolOptions option:selected').val();
		console.log("clicked " + selectedSchoolVal);
		updateCourseOptions(selectedSchoolVal);		
	});
	
	/**Verifies if username is not in the database. If it's available, create account*/
	function userExistsCallback(userId, exists) {
        if (exists) {	//userId exists
          alert('Username ' + userId + ' already exists. Please pick another one.');
		  document.getElementById("username").value = ""; //reset field
        } else {	//userId is unique
			firebase.auth().createUserWithEmailAndPassword($('#email').val(), $('#pass').val()).then(function(user){
				//set up profile
				createUserProfile($('#username').val(), $('#firstname').val(), $('#lastname').val(), $('#school').val(), $('#email').val(), $('#phone').val());
				
				//update displayName to the username
				var user = firebase.auth().currentUser;
				user.updateProfile({
					displayName: userId
				}).then(function() {
					console('displayname updated to: ' + userId);
				}, function(error) {
				   console('displayname not updated');
				});
				firebase.auth().onAuthStateChanged(function(user) {
					if (user) {
						// User is signed in.
						alert('Account successfully created. Welcome to BookRecycle ' + $('#firstname').val() + ' ' + $('#lastname').val() + '! ');
						window.location.href = "index.html";	//now logged in, go to homepage
					} else {
						// No user is signed in.
					}
				});
			}).catch(function(error) {
				// Handle Errors here like duplicate email
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log(errorCode);
				console.log(errorMessage);
				$('#welcomeMsg').html('<b>'+errorMessage+'</b>');
			});
        }
    }
       
    /**Tests to see if /users/<userId> has any data.*/
    function checkIfUserExists(userId) {
        //var usersRef = new Firebase("https://bookrecycle-5b8d1.firebaseio.com/users");
        //usersRef.child(userId).once('value').then(function(snapshot) {
        firebase.database().ref("users/" + userId).once('value').then(function(snapshot) {
			var exists = (snapshot.val() !== null);
			userExistsCallback(userId, exists);
			$('#spinner').hide();
        });
    }
	
	/**Sets user information to database*/
	function createUserProfile(userID, firstname, lastname, school, email, phone) {
		console.log('in create user profile ' + userID +' '+ firstname +' '+ lastname +' '+ school +' '+ email +' '+ phone);
		$.post("/createUserInfo",{userIDp:userID, firstnamep:firstname, lastnamep:lastname, schoolp:school, emailp:email, phonep:phone});
		//$.post("http://localhost:5000/createUserInfo",{userIDp:userID, firstnamep:firstname, lastnamep:lastname, schoolp:school, emailp:email, phonep:phone});
	}
	
	/**Create Account page create account button*/
	$("#createAccountButton").click(function() {
		var labels = ['firstname', 'lastname', 'school', 'email', 'phone', 'username', 'pass', 'passreenter'];
		var unfilled = false;
		//recolor unfilled inputs
		for(var ind=0; ind<labels.length; ind++){
			if ( ( $('#'+ labels[ind] + '').val() ) == null  || ( $('#'+ labels[ind] + '').val() ) == '' ){
				$('#'+ labels[ind] +'Lbl').css("color", "red");
				unfilled = true;
			}
			else
				$('#'+ labels[ind] +'Lbl').css("color", "black");
		}
		if (unfilled)//$('#firstname').val()=='' || $('#lastname').val()=='' || $('#email').val()=='' || $('#phone').val()==''|| $('#username').val()==''|| $('#pass').val()=='')	
			alert('Please enter required fields');
		//check if passwords match
		else if ($('#pass').val() != $('#passreenter').val() ){
			alert('Passwords do not match!');
			document.getElementById("pass").value = "";
			document.getElementById("passreenter").value = "";
		}
		else{
			//all fields are populated here, check if username is not used by other users
			$('#spinner').show();
			checkIfUserExists($('#username').val());
		}
	});
	
	/**Login button*/
	$("#loginButton").click(function() {
		if ($('#username').val()== '' && $('#pass').val()== '')
			alert('Please enter Username and Password');
		else if ($('#username').val()=='')
			alert('Please enter Username');
		else if ($('#pass').val()=='')
			alert('Please enter Password');
		else{
			var email = '';
			var username = $('#username').val();
			firebase.database().ref("users/" + username).once('value').then(function(snapshot) {
				var exists = (snapshot.val() !== null);
				if (exists){
					var emailGetter = firebase.database().ref('users/' + ($('#username').val()) +'/email');
					emailGetter.on('value', function(snapshot) {
						console.log('hey here');
						email = snapshot.val();
						firebase.auth().signInWithEmailAndPassword(email, $('#pass').val()).then(function(user){
							//var user = firebase.auth().currentUser;
							//login success
							var name = firebase.database().ref().child('users').child($('#username').val()).child('firstName');
							$('#welcomeMsgInLogin').html('<b>Welcome back to BookRecycle ' + name + '! '+ user.displayName  +'</b>');
							var username = $('#username').val();
							//now logged in, go to homepage
							window.location.href='index.html';  
							console.log(username);
						}).catch(function(error) {
							// Handle Errors here.
							console.log('fail');
							var errorCode = error.code;
							var errorMessage = error.message;
							console.log(errorMessage);
							$('#welcomeMsgInLogin').html('<b><div style="color:red">'+errorMessage+'</div></b>');
						});
					});
				}
				else{
					console.log('Username ' + username + ' is not in system');
					$('#welcomeMsgInLogin').html('<b><div style="color:red">Username "'+ username +'" is not in our system. Please create an account.</div></b>');
				}
				  
				userExistsCallback(userId, exists);
			});
			
			console.log(email);
			
		}
	});
	
	/**Logout user currently signed in*/
	$("#logoutLink").click(function() {
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		  console.log('sign-out successful');
		}, function(error) {
		  // An error happened.
		  console.log('error in signing out');
		});
		location.reload();	//reload current page
	});

	/**Creates textbook posting using the parameters - allows a single user to post multiple books on the same course*/
	function createTextbookPosting(school, course, userID, title, author, price, isbn, note) {
		console.log('in createTextbookPosting function ' + school + ' ' + course + ' ' + userID + ' ' + title + ' ' + author + ' ' + price + ' ' + isbn + ' ' + note)
		//push data to database
		$.post("/postTextbook",{ schoolp:school, coursep:course, userIDp:userID,  titlep:title, authorp:author, pricep:price, isbnp:isbn, notep:note});
		//$.post("http://localhost:3000/postTextbook",{ schoolp:school, coursep:course, userIDp:userID,  titlep:title, authorp:author, pricep:price, isbnp:isbn, notep:note});
		/*var key = firebase.database().ref('school/' + school + '/' + course).push({
		sellerID: userID,
		title: title,
		author: author,
		price: price,
		isbn: isbn,
		note: note
		});*/
	}
	
	/**Create Postings page create posting button*/
	$("#createPostingButton").click(function() {
		console.log("clicked createposting button");
		if (firebase.auth().currentUser == null){
			alert('You are not signed in. Please sign in first.');
		}
		else{
			$('#spinner').show();
			console.log(firebase.auth().currentUser);
			var labels = ['schoolOptions', 'courseOptions', 'title', 'author', 'price']; //'isbn' and 'notes' are optional
			var unfilled = false;
			//recolor unfilled inputs
			for(var ind=0; ind<labels.length; ind++){
				if ( ( $('#'+ labels[ind] + '').val() ) == null  || ( $('#'+ labels[ind] + '').val() ) == '' ){
					$('#'+ labels[ind] +'Lbl').css("color", "red");
					unfilled = true;
				}
				else
					$('#'+ labels[ind] +'Lbl').css("color", "black");
			}
			if (unfilled)
				alert('Please enter required fields');
			else{
				// modify optional fields if blank to "none"
				var isbn = $('#isbn').val();
				var note = $('#note').val();
				if ($('#isbn').val() == "")
					isbn = "none";
				if ($('#note').val() == "")
					note = "none";
				firebase.auth().onAuthStateChanged(function(user) {
					if (user) {
						// User is signed in.
						//call function that creates the posting
						createTextbookPosting($('#schoolOptions').val(), $('#courseOptions').val(), user.displayName, $('#title').val(), $('#author').val(), $('#price').val(), isbn, note);
						alert("Post successfully created!");
						//$('#postSuccessMsg').html('<b>Post successfully created! </b>');
						//reset Create Posting form fields
						document.getElementById("schoolOptions").value = "-select-";
						document.getElementById("courseOptions").value = "-select-";
						document.getElementById("title").value = "";
						document.getElementById("author").value = "";
						document.getElementById("isbn").value = "";
						document.getElementById("price").value = "";
						document.getElementById("isbn").value = "";
						document.getElementById("note").value = "";
					 } else {
						// No user is signed in.
						('#postSuccessMsg').html('<b>Post unssuccessful</b>');
						console.log('else');
					}
				});
				$('#postSuccessMsg').html('<b>Post successfully created! </b>');
				$('#spinner').hide();
			}
		}
	});
	
	/**Textbook Postings search button*/
	$("#searchPostings").click(function() {
		if ($('#courseOptions').val() == null && $('#schoolOptions').val() == null)
			alert('Please select a school and a course.');
		else if ($('#courseOptions').val() == null)
			alert('Please select a course.');
		else if ($('#schoolOptions').val() == null)
			alert('Please select a school.');
		else{
			$('#spinner').show();
			var currentCourse = $('#courseOptions').val();
			var currentSchool = $('#schoolOptions').val();
			//call printpostings function
			printPostingToTable(currentCourse, currentSchool);
			//add to history stack
			history.pushState([currentSchool, currentCourse], "Result", "");	
			console.log("PUSHED This is course: "+ [currentSchool, currentCourse]);
		}
	});
	
	/**handle back and forward activities*/
	window.addEventListener('popstate', function(e) {
		//use history stack states
		document.getElementById("schoolOptions").value = (e.state)[0];
		updateCourseOptions((e.state)[0]);
		document.getElementById("courseOptions").value = (e.state)[1];
		printPostingToTable((e.state)[1], (e.state)[0]);
		console.log("In POP This is e: "+e.state);
	});
	
	 
});
