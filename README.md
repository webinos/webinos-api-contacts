# webinos contacts API #

**Service Type**: http://webinos.org/api/contacts

Contacts API provides methods to access user's unified address book. 

The webinos contacts API combines features from the WAC and the W3C contact APIs. 

The current implementation of the API support contacts from the following datasources:

- Google contacts
- Mozilla Thunderbird contacts
- Microsoft Outlook contacts (windows only)

## Installation ##

To install the contacts API you will need to install the node module inside the webinos pzp.

For end users, you can simply open a command prompt in the root of your webinos-pzp and do: 

	npm install https://github.com/webinos/webinos-api-contacts.git

For developers that want to tweak the API, you should fork this repository and clone your fork inside the node_module of your pzp.

	cd node_modules
	git clone https://github.com/<your GitHub account>/webinos-api-contacts.git
	npm install

## Getting a reference to the service ##

To discover the contacts api you will have to search for the "http://webinos.org/api/contacts" service. Example:

	var serviceType = "http://webinos.org/api/contacts";
	webinos.discovery.findServices( new ServiceType(serviceType), 
		{ 
			onFound: serviceFoundFn, 
			onError: handleErrorFn
		}
	);
	function serviceFoundFn(service){
		// Do something with the service
	};
	function handleErrorFn(error){
		// Notify user
		console.log(error.message);
	}

Alternatively you can use the webinos dashboard to allow the user choose the contacts API to use. Example:
 	
	webinos.dashboard.open({
         module:'explorer',
	     data:{
         	service:[
            	'http://webinos.org/api/contacts'
         	],
            select:"devices"
         }
     }).onAction(function successFn(data){
          if (data.result.length > 0){
          // User selected some contact APIs
     }});

## Methods ##

Once you have a reference to a contact API you can use the following methods.

### find (parameters, successCB, errorCB)

Returns a list of contacts matching the search criteria specified in the *parameters*.

### syncGoogleContacts (parameters, successCB, errorCB)

Returns true if contacts service is authenticated with GMail using username and password or a valid address book file could be open

### syncThunderbirdContacts (parameters, successCB, errorCB)

Synchronizes thunderbird contacts with local cache

### syncOutlookContacts (parameters, successCB, errorCB) 

Synchronizes Outlook contacts with local cache

**Available only on windows**


## Links ##

- [Usage examples](https://github.com/webinos/webinos-api-contacts/wiki/Examples)
- [Specifications](http://dev.webinos.org/specifications/api/contacts.html)
- [webinos enabled tweeting](https://developer.webinos.org/webinos-enabled-tweeting) (demo application)
- [Contacts app](https://github.com/webinos-apps/app-contacts) (very simple use of contacts API)

