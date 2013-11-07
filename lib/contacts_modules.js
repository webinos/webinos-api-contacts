/*******************************************************************************
 *   Code contributed to the webinos project
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *   
 *        http://www.apache.org/licenses/LICENSE-2.0
 *   
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Copyright 2013 Istituto Superiore Mario Boella (ISMB)
 ******************************************************************************/

var fs = require("fs");
var path = require("path");
var wPath = require("webinos-utilities").webinosPath.webinosPath() 

var local_contacts = '';
try {
    if(process.platform!=='android')
    {                
        local_contacts = require('./local_contacts');
        searchAbookPath();        
    }
    else //on android
    {
        local_contacts = require('bridge').load(require("../platform_interfaces.json").android.ContactManagerImpl, this);
    }
} catch (err) {console.log("<contactsAPI> ERROR: " + err)}

var c_def_path;
try{
    c_def_path = require('./contacts_def');
} catch (err) {console.log("<contactsAPI> ERROR: Could not load contacts_def");}

var Contact = c_def_path.Contact;
var ContactField = c_def_path.ContactField;
var ContactName = c_def_path.ContactName;
var ContactAddress = c_def_path.ContactAddress;
var ContactOrganization = c_def_path.ContactOrganization;

var RemoteContacts = require('./google_contacts');


if(local_contacts && process.platform!=='android')
{ 
    LocalContacts = new local_contacts.contacts();
}
else //on Android
{
    LocalContacts = local_contacts;
}

(fs.exists||path.exists)(wPath + "/userData/webinos-api-contacts", function(exists){
    if(!exists){
        fs.mkdir(wPath + "/userData/webinos-api-contacts/", function(err){
            if(!err)
                fs.writeFile(wPath + "/userData/webinos-api-contacts/userDetails.json", JSON.stringify(new Object()), function(err){
                    if(err) console.log("Contacts API: " + err);
                });
        });
    }
    else{
        (fs.exists||path.exists)(wPath + "/userData/webinos-api-contacts/userDetails.json", function(exists){
            if(!exists)
                fs.writeFile(wPath + "/userData/webinos-api-contacts/userDetails.json", JSON.stringify(new Object()), function(err){
                    if(err) console.log("Contacts API: " + err);
                });
        });
    }
});



var contactsPath = {};
contactsPath.thunderbird = path.normalize(wPath + "/userData/webinos-api-contacts/tContacts.json");
contactsPath.outlook = path.normalize(wPath + "/userData/webinos-api-contacts/oContacts.json");
contactsPath.google = path.normalize(wPath + "/userData/webinos-api-contacts/gContacts.json");


function searchAbookPath(){
    var pzpJsonPath = wPath + "/userData/webinos-api-contacts/userDetails.json";
    var pzp_json = require(pzpJsonPath);
    
    if ( !pzp_json.abook || pzp_json.abook === "")
    {
        // Is this the first time we search for an abook setting?
        var settingInit = (pzp_json.abook !== "");
        
        if (process.platform === "win32")
        {
            pzp_json.abook = searchAbook(process.env.AppData + "\\Thunderbird\\Profiles\\");
        }
        else if (process.platform === "linux")
        {
            pzp_json.abook = searchAbook(process.env.HOME + "/.thunderbird/");
        }
        // We failed to locate a mab file, let's add a place holder for manual setting.
        if (pzp_json.abook === null) {
            pzp_json.abook = "";
        }
        // Update the abook setting with the file path or an empty placeholder just the first time.
        if (pzp_json.abook !== null && (pzp_json.abook !== "" || settingInit))
        {
            fs.writeFile(pzpJsonPath, JSON.stringify(pzp_json, null, 1), function(arg){
                if(arg)
                    console.log("WRITE JSON: " + arg);
            });
        }
    }
}


function searchAbook(directory)
{
    //console.log("<contactsAPI> INFO: searching for abook.mab");
    
    // TODO: Support multiple *.mab files
    var dirContent;
    try {dirContent = fs.readdirSync(directory);}
    catch(er){return null;}

    for (var i=0; i<dirContent.length; i++)
    {
        //console.log(dirContent[i]);
         
        var next = dirContent[i];
         
        if (next === "abook.mab")
        {
            console.log("<contactsAPI> INFO: found addressbook in " + directory+next);
            return directory+next;
        }
        else
        {
            var l = searchAbook(path.normalize(directory+next+"/"));
            if (l !== null)
                return l;
        }
    }

    return null;
}

/**
 * map a raw (c++ like) contact to a w3c typed contact
 */
function rawContact2W3CContact(rawContact)
{
    //Fill Contact Name
    var _contactName = new ContactName(rawContact.name['formatted'], rawContact.name['familyName'],
        rawContact.name['givenName'], rawContact.name['middleName'], rawContact.name['honorificPrefix'],
        rawContact.name['honorificSuffix']);

    //Phone Numbers
    var _contactPhoneNumbers = new Array(rawContact.phoneNumbers.length);
    for ( var j = 0; j < rawContact.phoneNumbers.length; j++)
    {
        _contactPhoneNumbers[j] = new ContactField(rawContact.phoneNumbers[j]['value'], rawContact.phoneNumbers[j]['type'],
        Boolean(rawContact.phoneNumbers[j]['pref'] == "true"));
    }

    //Email Addresses
    var _contactEmails = new Array(rawContact.emails.length);
    for ( var j = 0; j < rawContact.emails.length; j++)
    {
        _contactEmails[j] = new ContactField(rawContact.emails[j]['value'], rawContact.emails[j]['type'],
        Boolean(rawContact.emails[j]['pref'] == "true"));
    }

    //Post Addresses _formatted
    var _contactAddresses = new Array(rawContact.addresses.length);
    for ( var j = 0; j < rawContact.addresses.length; j++)
    {
        _contactAddresses[j] = new ContactAddress(rawContact.addresses[j]['formatted'], rawContact.addresses[j]['type'],
        rawContact.addresses[j]['streetAddress'], Boolean(rawContact.addresses[j]['pref'] == "true"));
    }

    //Instant Messengers
    var _contactIms = new Array(rawContact.ims.length);
    for ( var j = 0; j < rawContact.ims.length; j++)
    {
        _contactIms[j] = new ContactField(rawContact.ims[j]['value'], rawContact.ims[j]['type'],
        Boolean(rawContact.ims[j]['pref'] == "true"));
    }

    //Organizations
    var _contactOrgs = new Array(rawContact.organizations.length);
    for ( var j = 0; j < rawContact.organizations.length; j++)
    {
        _contactOrgs[j] = new ContactOrganization(rawContact.organizations[j]['name'], rawContact.organizations[j]['type'],
        Boolean(rawContact.organizations[j]['pref'] == "true"), rawContact.organizations[j]['title']);
    }

    //Urls
    var _contactUrls = new Array(rawContact.urls.length);
    for ( var j = 0; j < rawContact.urls.length; j++)
    {
        _contactUrls[j] = new ContactField(rawContact.urls[j]['value'], rawContact.urls[j]['type'],
        Boolean(rawContact.urls[j]['pref'] == "true"));
    }

    //Photos (always 1, with libGCal)
    var _contactPhotos = new Array(rawContact.photos.length);
    for ( var j = 0; j < rawContact.photos.length; j++)
    {
        //Constructor ContactField(_value, _type, _pref)
        var _photo = "";
        if (rawContact.photos[j]['value'].trim().indexOf('file:') === 0)
        {
            var fs = require('fs');
            var Buffer = require('buffer').Buffer;
            //var constants = require('constants');
            
            _photo = new Buffer(fs.readlinkSync(rawContact.photos[j]['value'].trim())).toString('base64');
        }
        else
        {
            _photo = rawContact.photos[j]['value'].trim();
        }
        
        _contactPhotos[j] = new ContactField(_photo, rawContact.photos[j]['type'],
        Boolean(rawContact.photos[j]['pref'] == "true"));
    }

    //Fill Contact
    /*
     * _id, _displayName, _name, _nickname, _phonenumbers, _emails, _addrs, _ims,
     * _orgs, _rev, _birthday, _gender, _note, _photos, _categories, _urls,
     * _timezone
     *
     */

    var _contact = new Contact(rawContact.id, rawContact.displayName, _contactName, rawContact.nickname,
        _contactPhoneNumbers, _contactEmails, _contactAddresses, _contactIms, _contactOrgs, new Date(rawContact.revision),
        new Date(rawContact.birthday), rawContact.gender, rawContact.note, _contactPhotos, rawContact.categories,
        _contactUrls, rawContact.timezone);

    return _contact;
}


/**
 * map win32ole to w3c contact
 */
function msContact2W3CContact(rawContact)
{
    //trying to avoid to propagate weird typos inherit form C++ bindings
    for(var i in rawContact)
        if(typeof rawContact[i] != "function")
            rawContact[i] = String(rawContact[i]);
    
    
    //Contact Name
    var _contactName = new ContactName(rawContact.FullName, rawContact.FirstName, rawContact.LastName, rawContact.MiddleName, "", "");
    
    //Phone Numbers
    var _contactPhoneNumbers = new Array(5);
    _contactPhoneNumbers[0] = new ContactField(rawContact.PrimaryTelephoneNumber, "other", true);
    _contactPhoneNumbers[1] = new ContactField(rawContact.MobileTelephoneNumber, "mobile", false);
    _contactPhoneNumbers[2] = new ContactField(rawContact.BusinessTelephoneNumber, "work", false);
    _contactPhoneNumbers[3] = new ContactField(rawContact.CompanyMainTelephoneNumber, "work", false);
    _contactPhoneNumbers[4] = new ContactField(rawContact.OtherTelephoneNumber, "other", false);
    
    //Email Addresses
    var _contactEmails = new Array(3);
    _contactEmails[0] = new ContactField(rawContact.Email1Address, "other", true);
    _contactEmails[1] = new ContactField(rawContact.Email2Address, "other", false);
    _contactEmails[2] = new ContactField(rawContact.Email3Address, "other", false);
    
    //Post Addresses _formatted
    var _contactAddresses = new Array(4);
    _contactAddresses[0] = new ContactAddress(rawContact.HomeAddress, "home", rawContact.HomeAddressStreet, false, rawContact.HomeAddressCity, rawContact.HomeAddressState, rawContact.HomeAddressPostalCode, rawContact.HomeAddressCountry);
    _contactAddresses[1] = new ContactAddress(rawContact.MailingAddress, "mailing", rawContact.MailingAddressStreet, false, rawContact.MailingAddressCity, rawContact.MailingAddressState, rawContact.MailingAddressPostalCode, rawContact.MailingAddressCountry);
    _contactAddresses[2] = new ContactAddress(rawContact.BusinessAddress, "business", rawContact.BusinessAddressStreet, false, rawContact.BusinessAddressCity, rawContact.BusinessAddressState, rawContact.BusinessAddressPostalCode, rawContact.BusinessAddressCountry);
    _contactAddresses[3] = new ContactAddress(rawContact.OtherAddress, "other", rawContact.OtherAddressStreet, false, rawContact.OtherAddressCity, rawContact.OtherAddressState, rawContact.OtherAddressPostalCode, rawContact.OtherAddressCountry);
    
    //Instant Messengers
    var _contactIms = new Array(1);
    _contactIms[0] = new ContactField(rawContact.IMAddress, "other", true);
    
    //Organizations
    var _contactOrgs = new Array(1);
    _contactOrgs[0] = new ContactOrganization(rawContact.CompanyName, "", true, rawContact.JobTitle, "");
    
    //Urls
    var _contactUrls = new Array(1);
    _contactUrls[0] = new ContactField(rawContact.WebPage, "", true);
    
    //Photos
    var _contactPhotos = new Array(0);
    
    //Fill Contact
    /*
     * _id, _displayName, _name, _nickname, _phonenumbers, _emails, _addrs, _ims,
     * _orgs, _rev, _birthday, _gender, _note, _photos, _categories, _urls,
     * _timezone
     *
     */
    var _contact = new Contact(rawContact.EntryID, rawContact.FullName, _contactName, rawContact.NickName,
                               _contactPhoneNumbers, _contactEmails, _contactAddresses, _contactIms, _contactOrgs, "",
                               "", "", "", _contactPhotos, rawContact.Categories, _contactUrls, "");
    
    return _contact;
}


this.syncThunderbirdContacts=function(params, successCB, errorCB){
    if(process.platform === "android")
    {
        errorCB(this.NOT_SUPPORTED_ERROR);
        return;
    }
    else
    {
        var contacts_l;
        var rawContacts;
        var pzpJsonPath = wPath + "/userData/webinos-api-contacts/userDetails.json";
        var pzp_json = require(pzpJsonPath);
        
        if (pzp_json.abook !== null && pzp_json.abook !== "")
        {            
            LocalContacts.open(pzp_json.abook);
            rawContacts = LocalContacts.getAB();
            contacts_l = new Array(rawContacts.length);
            for ( var i = 0; i < rawContacts.length; i++)
            {
                contacts_l[i] = rawContact2W3CContact(rawContacts[i]);
            }            
            
            contacts_l = JSON.parse(JSON.stringify(contacts_l));
            write2cache(contacts_l, contactsPath.thunderbird, successCB);                                    
        }
        else if (errorCB)
            errorCB(this.NOT_FOUND_ERROR);        
    }
}

this.syncOutlookContacts=function(params, successCB, errorCB){
    if(process.platform !== "win32" )
    {
        errorCB(this.NOT_SUPPORTED_ERROR);
        return;
    }
    else //win32
    {
        var msContacts = require("./outlook_contacts.js");
        var contactArray = new Array();
        var msContacts = msContacts.getOutlookContacts;
        for(var i=0;i<msContacts.length;i++)
            contactArray.push(msContact2W3CContact(msContacts[i]));
        
        write2cache(JSON.parse(JSON.stringify(contactArray)), contactsPath.outlook, successCB);
    }
}

this.syncGoogleContacts=function(params, successCB, errorCB)
{   
    if(process.platform === "android"){
        errorCB(this.NOT_SUPPORTED_ERROR);
        return;
    }    
    if(params[0].scope != "https://www.google.com/m8/feeds/"){
        errorCB(this.INVALID_ARGUMENT_ERROR);
        return;
    }
    RemoteContacts.getContacts(params, function(contacts){write2cache(contacts, contactsPath.google, successCB);}, errorCB);   
}


function write2cache(contacts, path, successCB){
    fs.writeFile(path, JSON.stringify(contacts, null, 1), function(err){
        if(err) 
            errorCB(err);
        else{
            console.log("<contactsAPI> INFO: contacts loaded");          
            successCB("Contacts written to cache file " + path);
        }
    });
};

function loadCache(callback){
    var contacts = new Array();        
    
    var loaded;    
    loaded=readCache(contactsPath.thunderbird);
    contacts = loaded ? contacts.concat(loaded) : contacts;
    
    loaded=readCache(contactsPath.outlook);
    contacts = loaded ? contacts.concat(loaded) : contacts;
    
    loaded=readCache(contactsPath.google);
    contacts = loaded ? contacts.concat(loaded) : contacts;
    
    callback(contacts);
}

function readCache(path){
    if ((fs.existsSync||fs.existsSync)(path)){
        var contacts_j = fs.readFileSync(path, 'utf8');
        contacts_j = JSON.parse(contacts_j);        
        return contacts_j;
    }
}

var ContactFindOptions = {};
ContactFindOptions.filter = "";
ContactFindOptions.multiple = false;
ContactFindOptions.updatedSince = ""; //this is a Date

/**
 * Retrieve a list of contatcs matching fields specified in field
 *
 */
this.findContacts = function(filters, successCB, errorCB)
{
    if (successCB === null || successCB === undefined)
        throw TypeError("Please provide a success callback");

    if( process.platform !== 'android')
    {
        loadCache(function(c_list)
        {
            var res = c_list;
            res = filterContacts(filters[0], res);            
            successCB(res);
        });
    }
    else //on Android
    {
        console.log("<contactsAPI> INFO: find on android, local");
        if(!options)
            options=new Array();
        LocalContacts.find(fields, successCB, errorCB, options);
    }
};


/*
 * Filter contacts by checking their attributes key and values are always string
 * returns a filtered array of Contacts or an empty array
 */
function filterContacts(filterObj, c_array)
{
    var ret_array = new Array();
    var push;

    if(!filterObj)
    {
        console.log("<contactsAPI> ERROR: filterContacts: no filter object provided");
        return c_array;
    }
         
    for ( var i = 0; i < c_array.length; i++)
    {
        push = true;
        
        if (filterObj.id && filterObj.id!="")
        {
            if (c_array[i].id !== filterObj.id)
                push = false;
        }
        
        if (filterObj.displayName && filterObj.displayName!="")
        {
            if (c_array[i].displayName !== filterObj.displayName)
            {
                push = false;
            }
        }
        
        //Comparing the "name" complex object 
        if (filterObj.name && filterObj.name!="")
        {
            if(c_array[i].name.formatted !== filterObj.name)
                push = false;
                    
            //This part would enable a comparison between ContactsName objects
            /*
            if (filterObj.name.formatted && filterObj.name.formatted!="")
                if(c_array[i].name.formatted !== filterObj.name.formatted)
                    push = false;
            if (filterObj.name.familyName && filterObj.name.familyName!="")
                if(c_array[i].name.familyName !== filterObj.name.familyName)
                    push = false;
            if (filterObj.name.givenName && filterObj.name.givenName!="")
                if(c_array[i].name.givenName !== filterObj.name.givenName)
                    push = false;
            if (filterObj.name.middleName && filterObj.name.middleName!="")
                if(c_array[i].name.middleName !== filterObj.name.middleName)
                    push = false;        
            if (filterObj.name.honorificPrefix && filterObj.name.honorificPrefix!="")
                if(c_array[i].name.honorificPrefix !== filterObj.name.honorificPrefix)
                    push = false; 
            if (filterObj.name.honorificSuffix && filterObj.name.honorificSuffix!="")
                if(c_array[i].name.honorificSuffix !== filterObj.name.honorificSuffix)
                    push = false;
            */
        }
        
        //Comparing the "nickname"
        if (filterObj.nickname && filterObj.nickname!="")
            if(c_array[i].nickname !== filterObj.nickname)
                push = false;
                
        //Comparing the "displayName"
        if (filterObj.displayName && filterObj.displayName!="")
            if(c_array[i].displayName !== filterObj.displayName)
                push = false;
        
        if (filterObj.addresses)
        {
            if (c_array[i].addresses)
            {
                var p = false;
                for (var j=0; j<c_array[i].addresses.length; j++)
                {
                    var u = true;
                    if (filterObj.addresses.formatted    && filterObj.addresses.formatted!="")
                        if (c_array[i].addresses[j].formatted !== filterObj.addresses.formatted)
                            u = false, console.log("1\n\n");
                    if (filterObj.addresses.streetAddress && filterObj.addresses.streetAddress!="")
                        if (c_array[i].addresses[j].streetAddress !== filterObj.addresses.streetAddress)
                            u = false, console.log("2\n\n");
                    if (filterObj.addresses.locality && filterObj.addresses.locality!="")
                        if (c_array[i].addresses[j].locality !== filterObj.addresses.locality)
                            u = false, console.log("3\n\n");
                    if (filterObj.addresses.region && filterObj.addresses.region!="")
                        if (c_array[i].addresses[j].region !== filterObj.addresses.region)
                            u = false, console.log("4\n\n");
                    if (filterObj.addresses.postalCode && filterObj.addresses.postalCode!="")
                        if (c_array[i].addresses[j].postalCode !== filterObj.addresses.postalCode)
                            u = false, console.log("5\n\n");
                    if (filterObj.addresses.country && filterObj.addresses.country!="")
                        if (c_array[i].addresses[j].country !== filterObj.addresses.country)
                            u = false, console.log("6\n\n");
                    u?p=true:null;
                }
                !p?push=false:null;
            }
            else
                push=false;
        }
        
        
        //Comparing the emails array
        if (filterObj.emails && filterObj.emails!="")
        {
            if (c_array[i].emails)
            {
                var p = false
                for (var j=0; j<c_array[i].emails.length; j++)
                {
                    if (c_array[i].emails[j].value === filterObj.emails)
                        p = true;
                }
                !p?push=false:null; 
            }
            else
                push = false;
        }
        
        //Comparing the organizzations array
        if (filterObj.organizations)
        {
            if(c_array[i].organizations)
            {
                var p = false;
                for (var j=0; j<c_array[i].organizations.length; j++)
                {
                    if (c_array[i].organizations[j].name === filterObj.organizations)
                        p=true;
                }
                !p?push=false:null;
            }
            else
                push = false;
        }
        
        //TODO in order to compare the birthday property check how the json parser parse Date type
        /*if (c_array[i].birthday === filterObj.displayName)
        {
            ret_array.push(c_array[i]);
            continue;
        }*/
        
        //Comparing the phoneNumbers array
        if (filterObj.phoneNumbers)
        {
            if (c_array[i].phoneNumbers)
            {
                var p = false
                for (var j=0; j<c_array[i].phoneNumbers.length; j++)
                {
                    if (filterObj.phoneNumbers &&    filterObj.phoneNumbers!="")
                        if (c_array[i].phoneNumbers[j].value === filterObj.phoneNumbers)
                            p = true;
                }
                !p?push=false:null;
            }
            else
                push = false;
        }
        
        if (filterObj.ims && filterObj.ims!="")
        {
            if (c_array[i].ims)
            {
                var p = false;
                for (var j=0; j<c_array[i].ims.length; j++)
                {
                    if (c_array[i].ims[j].value === filterObj.ims)
                        p=true;
                }
                !p?push=false:null;
            }
            else
                push = false;
        }
        
        if (filterObj.gender && filterObj.gender!="")
            if(c_array[i].gender !== filterObj.gender)
                push = false;
                
        if (filterObj.note && filterObj.note!="")
            if(c_array[i].note !== filterObj.note)
                push = false;
                
        if (filterObj.categories && filterObj.categories!="")
        {
            if (c_array[i].categories)
            {
                var p = false;
                for (var j=0; j<c_array[i].categories.length; j++)
                {
                    if(c_array[i].categories[j] === filterObj.categories)
                        p=true;
                }
                !p?push=false:null;
            }
            else
                push = false;
        }
         
        
        if (filterObj.urls && filterObj.urls!="")
        {
            if (c_array[i].urls)
            {
                var p = false;
                for (var j=0; j<c_array[i].urls.length; j++)
                {
                    if (c_array[i].urls[j].value === filterObj.urls)
                            p=true;
                }
                !p?push=false:null;
            }
            else
                push = false;
        }
        
        if (filterObj.timezone && filterObj.timezone!="")
            if(c_array[i].timezone !== filterObj.timezone)
                push = false;
        
        
        if (push)
            ret_array.push(c_array[i]);
    }
    return ret_array;
}

/**
 * Check types of object obj Tries to uniform typeof and instanceof, literals
 * and Objects e.g. String or string type may be either a string or a function
 */
function typeCheck(obj, type)
{
    var res = false;
    if (typeof (type) == "string")
    {
        if (typeof (obj) == type)
            res = true;
    }
    else if (typeof (type) == "function")
    {
        if (obj instanceof type)
            res = true;
    }
    return res;
}

/**
 * Compare a string with a date to a Date obj Needed to compare only Year, Month
 * and Date without making a mess with hours and timezones e.g. birthdays
 */
function stringEqDate(dateStr, date)
{
    var tmp = new Date(dateStr);
    return (tmp.getFullYear() == date.getFullYear() && tmp.getMonth() == date.getMonth() && tmp.getDate() == date.getDate())
}

/*
 *ERROR HANDLING
 */
this.UNKNOWN_ERROR = 0;
this.INVALID_ARGUMENT_ERROR = 1;
this.TIMEOUT_ERROR = 2;
this.PENDING_OPERATION_ERROR = 3;
this.IO_ERROR = 4;
this.NOT_SUPPORTED_ERROR = 5;
this.NOT_FOUND_ERROR = 8;
this.PERMISSION_DENIED_ERROR = 20;

function ContactError(_code)
{
    this.code = _code; // readonly ?
};
    
