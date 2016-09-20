$( document ).ready(function() {
	window.history;
	var textbookIDctr = 0;
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
	function Textbook(course, title, author, isbn, price, notes){
		this.courseID = course;
		this.title = title;
		this.author = author;
		this.isbn = isbn;
		this.price = price;
		this.notes = notes;
		textbookIDctr++;
		this.ID = textbookIDctr;
	}
	
	var gmuCourses = ["CS100", "CS101", "CS105", "CS112", "CS211", "CS222", "CS262", "CS306", "CS310", "CS321", "CS330", "CS332", "CS367", "CS390", "CS425", "CS450", "CS451", "CS465", "CS469", "CS471", "CS477", "CS480", "CS482", "CS483", "CS484", "CS485", "CS490", "SWE205", "SWE432", "SWE437", "SWE443"];
	var jmuCourses = ["CS112", "CS211", "CS222", "CS262", "SWE432"];
	var uvaCourses = ["CS1010", "CS1110", "CS1111", "CS1112", "CS1113", "CS2102", "CS2110", "CS2150", "CS2910", "CS3102", "CS3205", "CS3240", "CS3330", "CS4102", "CS4414", "CS4457", "CS4457", "CS4501", "CS4630", "CS4710", "CS4720", "CS4740", "CS4750", "CS4753", "CS4810", "CS4970", "CS4980", "CS4993", "CS4998"];
	var schoolCourseMap = new Map();
	schoolCourseMap.set("GMU", gmuCourses);
	schoolCourseMap.set("JMU", jmuCourses);
	schoolCourseMap.set("UVA", uvaCourses);
	
	var usersMap = new Map();
	usersMap.set("mbauzon", new User("Josh", "Bauzon", "GMU", "mbauzon@gmu.edu", "123456789", "mbauzon", "joshpassword"));
	usersMap.set("xfang5", new User("Xiaowen", "Fang", "GMU", "xfang5@gmu.edu", "111111111", "xfang5", "xiaowenpassword"));
	usersMap.set("jmuStudent", new User("Michael", "Smith", "JMU", "jmuStudent@jmu.edu", "5555555555", "jmuStudent", "jmustudentpassword"));
	usersMap.set("uvaStudent", new User("William", "Johnson", "UVA", "uvaStudent@uva.edu", "6666666666", "uvaStudent", "uvastudentpassword"));
	
	var textbook1Josh = new Textbook("CS332", "PROGRAM DEVELOPMENT IN JAVA", "Liskov", "", 30, "new sealed");
	var textbook2Josh = new Textbook("CS332", "EFFECTIVE JAVA:PROGRAMMING LANG.GDE.", "Bloch", "", 40, "used but good condition");
	var textbook1Xiaowen = new Textbook("CS332", "PROGRAM DEVELOPMENT IN JAVA", "Liskov", "", 25, "partly used");
	var textbook3Josh = new Textbook("CS211", "GMU texbook for CS211", "Thomas LaToza", "", 45, "semi-new");
	var textbook1jmuStudent = new Textbook("CS211", "JMU texbook for CS211", "Thomas LaToza", "", 50, "brand new");
	var textbook1uvaStudent = new Textbook("CS211", "UVA texbook for CS211", "Thomas LaToza", "", 35, "used");
	
	var gmuTextbookSet = new Set();
	gmuTextbookSet.add("CS332");
	gmuTextbookSet.add("CS211");
	var textbooksSchoolMap = new Map();
	textbooksSchoolMap.set("GMU", gmuTextbookSet);
	
	var jmuTextbookSet = new Set();
	jmuTextbookSet.add("CS211");
	textbooksSchoolMap.set("JMU", jmuTextbookSet);
	var uvaTextbookSet = new Set();
	uvaTextbookSet.add("CS2110");
	textbooksSchoolMap.set("UVA", uvaTextbookSet);
	
	var textbooksCourseMap = new Map();
	textbooksCourseMap.set("CS332", [textbook1Josh, textbook2Josh, textbook1Xiaowen]);
	textbooksCourseMap.set("CS211", [textbook3Josh, textbook1jmuStudent]);//, textbook1uvaStudent]);
	textbooksCourseMap.set("CS2110", [textbook1uvaStudent]);
	
	var textbookUserMapping = new Map();
	textbookUserMapping.set(textbook1Josh.ID, "mbauzon");
	textbookUserMapping.set(textbook2Josh.ID, "mbauzon");
	textbookUserMapping.set(textbook1Xiaowen.ID, "xfang5");
	textbookUserMapping.set(textbook3Josh.ID, "mbauzon");
	textbookUserMapping.set(textbook1jmuStudent.ID, "jmuStudent");
	textbookUserMapping.set(textbook1uvaStudent.ID, "uvaStudent");
	
	/**prints table of postings based on courseID and school */
	function printPostingToTable(courseID, school) {
		//check if courseID and school are in our maps
		console.log('in printPostingToTable School: ' + school + ' course ' + courseID );
		var table = document.getElementById("searchResultTable");
		$('#searchResultTable td').remove(); 	//reset table
		
		if (textbooksSchoolMap.get(school)!=null && (textbooksSchoolMap.get(school)).has(courseID))//textbooksCourseMap.get(courseID) != null)
			$('#postingsAppear').html('<b>Postings for ' + courseID + ' by ' + school + ' students:</b>');
		else
			$('#postingsAppear').html('<b>Sorry, there are currently no postings for ' + courseID + ' by ' + school + ' students.</b>');
							
		var booksArray = textbooksCourseMap.get(courseID);
		if (booksArray!=null)
			for (var book of booksArray){
				var usernameOfThis = textbookUserMapping.get(book.ID);
				if ((usersMap.get(usernameOfThis)).school == school){
					console.log('in if');
					var row = table.insertRow(table.rows.length);	//add row at the bottom
					var course = row.insertCell(0);
					var textbookTitle = row.insertCell(1);
					var author = row.insertCell(2);
					var seller = row.insertCell(3);
					var email = row.insertCell(4);
					var phone = row.insertCell(5);
					var notes = row.insertCell(6);
					var price = row.insertCell(7);
					
					//set the values in the cells
					course.innerHTML = courseID;
					textbookTitle.innerHTML = book.title;
					author.innerHTML = book.author;
					seller.innerHTML = (usersMap.get(usernameOfThis)).fullName();
					email.innerHTML = (usersMap.get(usernameOfThis)).email;
					phone.innerHTML = (usersMap.get(usernameOfThis)).phone;
					notes.innerHTML = book.notes;
					price.innerHTML = book.price;
				}
			}
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
	$("#schoolOptions").change(function() {
		var selectedSchoolVal = $('#schoolOptions option:selected').val();
		console.log("clicked " + selectedSchoolVal);
		updateCourseOptions(selectedSchoolVal);		
	});
	/**Create Account page create account button*/
	$("#createAccount").click(function() {
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
		else if ($('#pass').val() != $('#passreenter').val() ){
			alert('Passwords do not match!');
			document.getElementById("pass").value = "";
			document.getElementById("passreenter").value = "";
		}
		else{
			var newUser = new User($('#firstname').val(), $('#lastname').val(), $('#school').val(), $('#email').val(), $('#phone').val(), $('#username').val(), $('#pass').val() );
			usersMap.set($('#username').val(), new User($('#firstname').val(), $('#lastname').val(), $('#school').val(), $('#email').val(), $('#phone').val(), $('#username').val(), $('#pass').val()));
			//line above currently does not work
			$('#welcomeMsg').html('<b>Account successfully created. Welcome to BookRecycle ' + newUser.fullName() + '!</b>');
		}
	});
	/**Login page login button*/
	$("#login").click(function() {
		if ($('#username').val()== '' && $('#pass').val()== '')
			alert('Please enter Username and Password');
		else if ($('#username').val()=='')
			alert('Please enter Username');
		else if ($('#pass').val()=='')
			alert('Please enter Password');
		else if (usersMap.get($('#username').val()) != null){
			if ((usersMap.get($('#username').val())).pass === $('#pass').val())		//SUCCEESS login
				$('#welcomeMsgInLogin').html('<b>Welcome ' + (usersMap.get($('#username').val())).fullName() + '!</b>');
			else
				alert('Username/Password did not match!');	//wrong password
		}
		else{
			alert('Username is not found! Try again or Create an Account!');	//username not in our database
			//reset data input fields
			document.getElementById("username").value = "";
			document.getElementById("pass").value = "";
		}
	});
	
	/**Create Postings page create posting button*/
	$("#createPosting").click(function() {
		console.log("clicked createposting");
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
			$('#postSuccessMsg').html('<b>Post successfully created! </b>');
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
			var currentCourse = $('#courseOptions').val();
			var currentSchool = $('#schoolOptions').val();
			printPostingToTable(currentCourse, currentSchool);
			history.pushState([currentSchool, currentCourse], "Result", "");	//add to history stack
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