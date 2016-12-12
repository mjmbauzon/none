$( document ).ready(function() {
	
	//<script src="https://www.gstatic.com/firebasejs/3.4.0/firebase.js"></script>
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
				firebase.database().ref("uploads/" + user.displayName+"/img").once('value').then(function(snapshot) {
					console.log("it is '"+snapshot.val()+"'");
					if (snapshot.val()!=null){
						var imglink = snapshot.val();
						$('#profImage').html('<img src="'+imglink+'" height="200" width="200">');
					}
					else{
						$('#profImage').html("<br/>You currently don't have a profile picture. Upload one now!");
					}
				});
				
				$('#welcomeIndex').show();
				//display logout tab
				$("#logoutLink").show();
				$("#loginLink").hide();
				$("#createAcctLink").hide();
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
				//hide upload prof pic form
				$("#uploadPicForm").hide();
				//hide my postings form
				$("#myPosts").hide();
				$("#myPostsNotLoggedIn").show();
			}
		});
	};
	
	/**Prints table of postings based on courseID and school */
	function printPostingToTable(courseID, school) {
		var table = document.getElementById("searchResultTable");
		$('#searchResultTable td').remove(); 	//reset table
		$('#postingsAppear').html('<b>Sorry, there are currently no postings for ' + courseID + ' by ' + school + ' students.</b>');  //default message; will be changed below, if there is something in teh database
		
		console.log('in print posting');
		var ref = new Firebase("https://bookrecycle-5b8d1.firebaseio.com/school/" + school + "/" + courseID);
		ref.once("value", function(snapshot) {			
		  	//go through each postingID of this school and course search combination
			snapshot.forEach(function(childSnapshot) {
				$('#postingsAppear').html('<b>Textbook postings for ' + courseID + ' at ' + school + ' are the following: ');
				
				console.log('current postingID: '+ childSnapshot.key());
				var postingID = childSnapshot.key();
				
				//add row at the bottom and insert cells
				var row = table.insertRow(table.rows.length);	
				var course = row.insertCell(0);
				var textbookTitle = row.insertCell(1);
				var isbn = row.insertCell(2);
				var author = row.insertCell(3);
				var sellerCell = row.insertCell(4);
				var email = row.insertCell(5);
				var phone = row.insertCell(6);
				var notes = row.insertCell(7);
				var price = row.insertCell(8);
				
				//get textbook info
				course.innerHTML = courseID;
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/title").once('value').then(function(snapshot) {
					textbookTitle.innerHTML = snapshot.val();
				});
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/isbn").once('value').then(function(snapshot) {
					isbn.innerHTML = snapshot.val();
				});
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/author").once('value').then(function(snapshot) {
					author.innerHTML = snapshot.val();
				});
				//get seller info (full name, email, phone)
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/sellerID").once('value').then(function(snapshot) {
					var sellerID = snapshot.val();
					firebase.database().ref("users/" + sellerID +"/firstName").once('value').then(function(snapshot) {
						var firstname = snapshot.val();
						firebase.database().ref("users/" + sellerID +"/lastName").once('value').then(function(snapshot) {
							sellerCell.innerHTML = firstname + " " + snapshot.val();
						});
					});
					firebase.database().ref("users/" + sellerID +"/email").once('value').then(function(snapshot) {
						email.innerHTML = snapshot.val();
					});
					firebase.database().ref("users/" + sellerID +"/phone").once('value').then(function(snapshot) {
						phone.innerHTML = snapshot.val();
					});
					
				});
				
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/note").once('value').then(function(snapshot) {
					notes.innerHTML = snapshot.val();
				});
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/price").once('value').then(function(snapshot) {
					price.innerHTML = snapshot.val();
				});
			});
		  $('#spinner').hide();	
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
						//now logged in, set up profile
						createUserProfile($('#username').val(), $('#firstname').val(), $('#lastname').val(), $('#school').val(), $('#email').val(), $('#phone').val());
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
				//alert(errorMessage+". Please sign");
				$('#welcomeMsg').html('<b><div style="color:red">'+errorMessage+' Please use a different email address or <a href="loginPage.html">sign in</a>.</div></b>');
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
		
		firebase.auth().currentUser.getToken().then(function(idToken) {
			$.post("/createUserInfo",{userIDp:userID, firstnamep:firstname, lastnamep:lastname, schoolp:school, emailp:email, phonep:phone, token: idToken});
            //$.post("http://localhost:5000/createUserInfo",{userIDp:userID, firstnamep:firstname, lastnamep:lastname, schoolp:school, emailp:email, phonep:phone, token: idToken});
        });
		//$.post("http://localhost:5000/createUserInfo",{userIDp:userID, firstnamep:firstname, lastnamep:lastname, schoolp:school, emailp:email, phonep:phone});
	}
	
	/**Create Account page create account button*/
	$("#createAccountButton").click(function() {
		var labels = ['firstname', 'lastname', 'school', 'email', 'phone', 'username', 'pass', 'passreenter'];
		$('#welcomeMsg').html('');
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
		firebase.auth().currentUser.getToken().then(function(idToken) {
			$.post("/postTextbook",{ schoolp:school, coursep:course, userIDp:userID,  titlep:title, authorp:author, pricep:price, isbnp:isbn, notep:note, token: idToken});
            //$.post("http://localhost:5000/postTextbook",{ schoolp:school, coursep:course, userIDp:userID,  titlep:title, authorp:author, pricep:price, isbnp:isbn, notep:note, token: idToken});
        });
		//$.post("http://localhost:5000/postTextbook",{ schoolp:school, coursep:course, userIDp:userID,  titlep:title, authorp:author, pricep:price, isbnp:isbn, notep:note});
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
				$('#spinner').show();
			
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
	
	$('#uploadPicForm').submit(function(e)
    {
		//check if user is logged in
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				console.log("displayname is "+user.displayName);
				//prompting user to enter username allows us to store the file with under is username
				if ($('#userPrompt').val() != user.displayName){
					alert("username entered is not correct");
				}
				else{
					if (document.getElementById("newFile").files.length == 0){ //check if there is a selected file
						alert("Select an image file to upload");
					}
					else if (!$('#newFile').val().match(/(?:gif|jpg|png|bmp)$/)) {	//check if file path is of type image
						alert("Please select an image file (jpg, png, gif, bmp)");
					}
					else{
						console.log("entered username is correct");
						e.preventDefault();
						var formData = new FormData($("#uploadPicForm")[0]);
						console.log(formData);
						$.ajax({
							type: "POST",
							url: "/upload",
							data: formData, processData: false,
							contentType: false
						});
						alert("File was successfully uploaded!");
						location.reload();
					}
				}
			}
			else{
				alert("Sign in first to upload");
			}
		});
    });
	
	//still under construction, not part of our 3 scenarios
	//very ineffecient way to search but hey it works
	function myPostingsBySchool(userID, school){
		var table = document.getElementById("myPostingsTable").getElementsByTagName('tbody')[0];
		$('#myPostingsTable td').remove();
		$('#myPostingsOptions').find('option').remove().end().append('<option disabled selected style="color:red">-select-</option>');//.val('whatever');
		
		
		var counter =1;
		var ref = new Firebase("https://bookrecycle-5b8d1.firebaseio.com/school/" + school);
		ref.once("value", function(snapshot) {			
		  	//go through each school course
			snapshot.forEach(function(childSnapshot) {
				console.log("here1 childsnapshot is " + childSnapshot.key());
				var currCourse = childSnapshot.key();
				//go through each course's listing
				var refCourses = new Firebase("https://bookrecycle-5b8d1.firebaseio.com/school/" + school + "/" + currCourse);  // school/schoolname/course here
				refCourses.once("value", function(snapshotCourse) {			
					//go through each listing
					snapshotCourse.forEach(function(snapshotCourseListing) {
						console.log("here2 snapshotCourseListing is " + snapshotCourseListing.key());
						var currListing = snapshotCourseListing.key();
						firebase.database().ref("school/" + school + "/" + currCourse + "/" + currListing + "/sellerID").once('value').then(function(snapshotSeller) {
							console.log("here3 snapshot.val = " + snapshotSeller.val() + " ::: userID = " + userID);
						
							// found a posting!
							if (snapshotSeller.val()==userID){
								//myPostingsTable
								
								var row = table.insertRow(table.rows.length);	
								var index = row.insertCell(0);
								var course = row.insertCell(1);
								var textbookTitle = row.insertCell(2);
								var author = row.insertCell(3);
								var isbn = row.insertCell(4);
								var seller = row.insertCell(5);
								var price = row.insertCell(6);
								var notes = row.insertCell(7);
								
								//get textbook info
								index.innerHTML = counter;
								course.innerHTML = currCourse;
								firebase.database().ref("school/" + school + "/" + currCourse + "/" + currListing + "/title").once('value').then(function(snapshotL) {
									textbookTitle.innerHTML = snapshotL.val();
								});
								firebase.database().ref("school/" + school + "/" + currCourse + "/" + currListing + "/author").once('value').then(function(snapshotL) {
									author.innerHTML = snapshotL.val();
								});
								firebase.database().ref("school/" + school + "/" + currCourse + "/" + currListing + "/isbn").once('value').then(function(snapshotL) {
									isbn.innerHTML = snapshotL.val();
								});
								firebase.database().ref("school/" + school + "/" + currCourse + "/" + currListing + "/sellerID").once('value').then(function(snapshotL) {
									seller.innerHTML = snapshotL.val();
								});			
								firebase.database().ref("school/" + school + "/" + currCourse + "/" + currListing + "/note").once('value').then(function(snapshotL) {
									notes.innerHTML = snapshotL.val();
								});
								firebase.database().ref("school/" + school + "/" + currCourse + "/" + currListing + "/price").once('value').then(function(snapshotL) {
									price.innerHTML = snapshotL.val();
								});
								
								console.log("adding option " + counter + " = " + currListing);
								$('#myPostingsOptions').append($('<option>', {
									value: currListing,
									text: counter
								}));
								
								counter++;
							}
								
						});
						
					});
				});
				console.log('current postingID: '+ childSnapshot.key());
				var postingID = childSnapshot.key();
				
			});
		  //$('#spinner').hide();	
		});
		
		
		//ref.child('users').orderByChild('name').equalTo('Alex').on('child_added',  ...)
	}
	
	//still under construction, not part of our 3 scenarios
	$("#searchMyPosts").click(function() {
		console.log("clicked search postings");
		$('#myPostingsTable').show();
		$('#deletePostsForm').show();
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				console.log("start searching postings of user " + user.displayName + " for " + $('#schoolOptionsMyPostings').val());
				myPostingsBySchool(user.displayName, $('#schoolOptionsMyPostings').val());
			}
		});
	});
	
	//still under construction, not part of our 3 scenarios
	$("#removePosting").click(function() {
	
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
