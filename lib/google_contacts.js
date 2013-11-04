/*******************************************************************************
*	Code contributed to the webinos project
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*	
*		 http://www.apache.org/licenses/LICENSE-2.0
*	
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* 
* Copyright 2013 Istituto Superiore Mario Boella (ISMB)
******************************************************************************/

var https = require('https');

//Webinos contact definition
var c_def_path = require('./contacts_def');
var Contact = c_def_path.Contact;
var ContactField = c_def_path.ContactField;
var ContactName = c_def_path.ContactName;
var ContactAddress = c_def_path.ContactAddress;
var ContactOrganization = c_def_path.ContactOrganization;


/*
 * function Contact(_id, _displayName, _name, _nickname, _phonenumbers, _emails,
 * _addrs, _ims, _orgs, _rev, _birthday, _gender, _note, _photos, _categories,
 * _urls, _timezone)
 * 
 * function ContactName(_formatted, _family, _given, _middle, _pre, _suf)
 * 
 * function ContactField(_value, _type, _pref)
 */
function newContact(i, item, picture, callback)
{
	"use strict";
	var id = item.id["$t"];
    var contactIndex = i;
	var displayName = item.title["$t"];
	var j;
	var num, type, pref,addr;
	
	var name = (item['gd$name'] === undefined) ? new ContactName() : new ContactName(item['gd$name']['gd$fullName'], item['gd$name']['gd$familyName'],
		item['gd$name']['gd$givenName'], item['gd$name']['gd$middleName'], item['gd$name']['gd$namePrefix'],
		item['gd$name']['gd$nameSuffix']);

    if(item['gContact$nickname'])
        var nickname = item['gContact$nickname']["$t"];
	var phonenumbers = [];
	if (item['gd$phoneNumber'] !== undefined) //contact has email
	{
        for (j=0; j<item['gd$phoneNumber'].length; j++)
        {
            num = item['gd$phoneNumber'][j]["$t"];
            type = item['gd$phoneNumber'][j].rel === undefined ? 'other' :item['gd$phoneNumber'][j].rel.substr(('http://schemas.google.com/g/2005#').length);
            pref = j==0?true:false;
            phonenumbers.push(new ContactField(num, type, pref));
        }
	}

	var emails = [];
	if (item['gd$email'] !== undefined) //contact has email
	{
        for (j=0; j<item['gd$email'].length; j++)
        {
            addr = item['gd$email'][j].address;
            type = item['gd$email'][j].rel === undefined ? 'other':item['gd$email'][j].rel.substr(('http://schemas.google.com/g/2005#').length);
            pref = item['gd$email'][j].primary;
            emails.push(new ContactField(addr, type, pref));
        }
	}

	var addrs = [];
	var formatted, locality, street, region, postCode, country;
	if (item['gd$structuredPostalAddress'] !== undefined) //contact has email
	{
		if (item['gd$structuredPostalAddress'].length !== undefined) //if is an array
		{
            if (item['gd$email'] && item['gd$email'].length) //if email is defined
            {
                for (j=0; j<item['gd$email'].length; j++)
                {
                    if (formatted = item['gd$structuredPostalAddress'][j]['gd$formattedAddress'])
                        formatted = item['gd$structuredPostalAddress'][j]['gd$formattedAddress']["$t"];
                        
                    type = 'other';
                    if(item['gd$structuredPostalAddress'][j].rel !==undefined)
                        type = item['gd$structuredPostalAddress'][j].rel.substr(('http://schemas.google.com/g/2005#').length);
                    if(item['gd$structuredPostalAddress'][j]['gd$street'])
                        street = item['gd$structuredPostalAddress'][j]['gd$street']["$t"];

                    j==0?pref=true:pref=false;
                    if(item['gd$structuredPostalAddress'][j]['gd$city'])
                        locality = item['gd$structuredPostalAddress'][j]['gd$city']["$t"];
                    if(item['gd$structuredPostalAddress'][j]['gd$region'])
                        region = item['gd$structuredPostalAddress'][j]['gd$region']["$t"];
                    if(item['gd$structuredPostalAddress'][j]['gd$postcode'])
                        postCode = item['gd$structuredPostalAddress'][j]['gd$postcode']["$t"];
                    if(item['gd$structuredPostalAddress'][j]['gd$country'])
                        country = item['gd$structuredPostalAddress'][j]['gd$country']["$t"];

                    addrs.push(new ContactAddress(formatted, type, street, pref, locality, region, postCode, country));
                }
            }
		}
		else //single address
		{
            if (item['gd$structuredPostalAddress'][j]['gd$formattedAddress'])
                formatted = item['gd$structuredPostalAddress']['gd$formattedAddress']["$t"];
			type = item['gd$structuredPostalAddress'].rel === undefined ? 'other' : item['gd$structuredPostalAddress'].rel.substr(('http://schemas.google.com/g/2005#').length);
			if(item['gd$structuredPostalAddress'][j]['gd$street'])
                street = item['gd$structuredPostalAddress']['gd$street']["$t"];
			pref = true;
            if(item['gd$structuredPostalAddress']['gd$city'])
                locality = item['gd$structuredPostalAddress']['gd$city']["$t"];
            if(item['gd$structuredPostalAddress']['gd$region'])
                region = item['gd$structuredPostalAddress']['gd$region']["$t"];
            if(item['gd$structuredPostalAddress']['gd$postcode'])
                postCode = item['gd$structuredPostalAddress']['gd$postcode']["$t"];
            if(item['gd$structuredPostalAddress']['gd$country'])
                country = item['gd$structuredPostalAddress']['gd$country']["$t"];

			addrs.push(new ContactAddress(formatted, type, street, pref, locality, region, postCode, country));
		}
	}

	var ims = [];
	if (item['gd$im'] !== undefined) //contact has IM
	{
		if (item['gd$im'].length !== undefined) //if is an array
		{
            for(j=0;j < item['gd$im'].length;j++)
            {
				addr = item['gd$im'][j].address;
				type = item['gd$im'][j].protocol.substr(('http://schemas.google.com/g/2005#').length);
				pref = (j == 0);
				ims.push(new ContactField(addr, type, pref));
			}
		}
		else //single address
		{
			addr = item['gd$im'].address;
			type = item['gd$im'].protocol.substr(('http://schemas.google.com/g/2005#').length);
			pref = 'true';
			ims.push(new ContactField(addr, type, pref));
		}
	}

	var orgs = [];
	if (item['gd$organization'] !== undefined)
	{
		orgs.push(new ContactOrganization(item['gd$organization']['gd$orgName'], item['gd$organization'].rel), true, item['gd$organization']['gd$orgTitle'],
			item['gd$organization']['gd$orgDepartment']);
	}
	
	var rev = new Date(item.updated);

	var birthday = item['gContact$birthday'] === undefined ? "" : new Date(item['gContact$birthday'].when);
	var gender = item['gContact$gender'];
	var note = item['gContact$jot'];
	var photos = [];

	if (picture.length > 0)
		photos.push(new ContactField(picture, 'file', true));

	var categories = [];

	var urls = [];
	if (item['gContact$website'] !== undefined) //contact has url
	{
		if (item['gContact$website'].length !== undefined) //if is an array
		{
            for(j=0;j < item['gContact$website'].length;j++)
			{
				addr = item['gContact$website'][j].href;
				type = item['gContact$website'][j].rel;
				urls.push(new ContactField(addr, type));
			}
		}
		else //single address
		{
			addr = item['gContact$website'].href;
			type = item['gContact$website'].rel;
			urls.push(new ContactField(addr, type));
		}
	}

	var timezone = "";

	callback(contactIndex, new Contact(id, displayName, name, nickname, phonenumbers, emails, addrs, ims, orgs, rev, birthday,
		gender, note, photos, categories, urls, timezone));
}




this.getContacts = function(params, successCB, errorCB)
{
	"use strict";
      
    var reqObj = {
            hostname: 'www.google.com',
        path: '/m8/feeds/contacts/default/full/'+'?max-results=1000&alt=json',        
        method: 'GET',
        headers: { 
            'Authorization': params[0].token_type + ' ' + params[0].access_token,
            'GData-Version': '3.0',
            'Host': 'www.google.com',            
        }        
    };
    
    https.get(reqObj, function(res) {        
            console.log("Response received: " + res.statusCode);
        var data = '';
        res.on('data', function(chunk){
                data+=chunk;
        });
        res.on('end', function(){
                console.log(data);
                data = eval ("(" + data +")");
                that.processJsonContacts(data.feed.entry);
        });
    }).on('error', function(e){
            console.log("Got error: " + e.message);
        errorCB(e.message);
    });  
        
    // Keep the context of this function for asynchronous calls.
    var that = this;    
        
    that.processJsonContacts = function(contacts) {
		var self = this;
        self.contacts = contacts;
        self.totalContacts = contacts.length;
        self.contact_list = new Array(contacts.length);

        /**
         * It will get the image for the give contact index id. will retry if it fails due to restriction of the service
         * More about this issue: https://groups.google.com/d/topic/google-contacts-api/qTjcz_wo68k/discussion
         * @param contactId
         */
        self.safelyGetImages = function (contactId) {
            var contact = self.contacts[contactId];
            if (contact.link[0] && contact.link[0]["gd$etag"]) 
            {
                var googleName = "https://www.google.com";
                var photo_url = contact.link[0].href.substr(googleName.length);
                var photoGet =
                {
                    host: 'www.google.com',
                    path: photo_url,
                    port: 443,
                    method:'GET',
                    headers:{
                        'Authorization': params[0].token_type + ' ' + params[0].access_token
                    }
                };
                var get_photo = https.request(photoGet, function (response) {
                    if (response.statusCode === 200) 
                    {
                        response.setEncoding('binary');
                        var buffer = "";
                        response.on("data", function (data) {
                            buffer += data;
                        });
                        response.on("end", function () {
                            var photo = new Buffer(buffer, 'binary').toString('base64');
                            newContact(contactId, contact, photo, self.getWebinosContact);
                        });
                        response.on("close", function () {
                        });
                    } 
                    else
                        setTimeout(function () {self.safelyGetImages(contactId);}, 1000);
                });
                get_photo.end();
            }
            else //Contact doesn't have a photo.                
                newContact(contactId, contact, "", self.getWebinosContact);
        };

        var processedContacts = 0;
        /**
         * It will collect all the processed contacts and store them in the right order (the one we recieved them.
         * It will return the processed contact list to the seccussCB when all contacts are done.
         * @param contactIndex
         * @param contact
         */
        self.getWebinosContact = function(contactIndex, contact){
            self.contact_list[contactIndex] = contact;
            processedContacts++;
            if (processedContacts == self.totalContacts)
                successCB(self.contact_list);
        };

        for (var k = 0; k < contacts.length; k++)
            self.safelyGetImages(k);
	}
};
