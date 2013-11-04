/*******************************************************************************
 *    Code contributed to the webinos project
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *    
 *         http://www.apache.org/licenses/LICENSE-2.0
 *    
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Copyright 2013 Istituto Superiore Mario Boella (ISMB)
 ******************************************************************************/

/**
 * Empty Constructor for ContactName Implements W3C ContactName as in
 * http://dev.webinos.org/specifications/draft/contacts.html
 */
function ContactName()
{
	"use strict";
}

ContactName.prototype.formatted = "";
ContactName.prototype.familyName = "";
ContactName.prototype.givenName = "";
ContactName.prototype.middleName = "";
ContactName.prototype.honorificPrefix = "";
ContactName.prototype.honorificSuffix = "";

//ContactName.prototype.toString = function()
//{
//	"use strict";
//  return name.formatted + "";
//};

/**
 * Constructor for ContactName with type checks. Implements W3C ContactName as
 * in http://dev.webinos.org/specifications/draft/contacts.html
 */
function ContactName(_formatted, _family, _given, _middle, _pre, _suf)
{
  "use strict";
  this.formatted = _formatted ? _formatted["$t"] : "";
  this.familyName = _family ? _family["$t"] : "";
  this.givenName = _given ? _given["$t"] : "";
  this.middleName = _middle ? _middle["$t"] : "";
  this.honorificPrefix = _pre ? _pre["$t"] : "";
  this.honorificSuffix = _suf ? _suf["$t"] : "";
}

/**
 * Empty Constructor for ContactField. Implements W3C ContactField as in
 * http://dev.webinos.org/specifications/draft/contacts.html
 */
function ContactField()
{
  "use strict";
}

ContactField.prototype.type = "";
ContactField.prototype.value = "";
ContactField.prototype.pref = false;

//ContactField.prototype.toString = function()
//{
//  if (!this.isEmpty())
//    return this.type + ": " + this.value + (this.pref ? " *" : "") + "";
//  else
//    return "";
//};

ContactField.prototype.isEmpty = function()
{
	"use strict";
  return (this.value === "");
};

/**
 * Constructor for ContactField with type checks. Implements W3C ContactField as
 * in http://dev.webinos.org/specifications/draft/contacts.html
 */
function ContactField(_value, _type, _pref)
{
  "use strict";
    
  this.value = _value ? String(_value) : "";
  this.type = _type ? String(_type) : "";
  this.pref = _pref ? Boolean(_pref) : "";    
}

/**
 * Empty Constructor for ContactAddress. Implements W3C ContactAddress as in
 * http://dev.webinos.org/specifications/draft/contacts.html
 */
function ContactAddress()
{
 "use strict";
}

ContactAddress.prototype.pref = false;
ContactAddress.prototype.type = "";
ContactAddress.prototype.formatted = "";
ContactAddress.prototype.streetAddress = "";
ContactAddress.prototype.locality = "";
ContactAddress.prototype.region = "";
ContactAddress.prototype.postalCode = "";
ContactAddress.prototype.country = "";

/**
 * Constructor for ContactAddress with type checks. Implements W3C
 * ContactAddress as in
 * http://dev.webinos.org/specifications/draft/contacts.html
 */
function ContactAddress(_formatted, _type, _street, _pref, _locality, _region, _postalCode, _country)
{
  "use strict";
 
  this.pref = _pref ? Boolean(_pref) : "";
  this.type = _type ? _type : "";
  this.streetAddress = _street ? _street : "";
  this.locality = _locality ? _locality : "";
  this.region = _region ? _region : "";
  this.postalCode = _postalCode ? _postalCode : "";
  this.country = _country ? _country : "";
  this.formatted = _formatted ? _formatted : "";
}

//ContactAddress.prototype.toString = function()
//{
//  if (!this.isEmpty())
//    return (this.type == "" ? "other" : this.type) + ": " + this.formatted + (this.pref ? " *" : "") + "";
//  else
//    return "";
//};

ContactAddress.prototype.isEmpty = function()
{
  "use strict";
  return (this.formatted === "");
};

/**
 * Empty Constructor for ContactOrganization. Implements W3C ContactOrganization
 * as in http://dev.webinos.org/specifications/draft/contacts.html
 */
function ContactOrganization()
{
 "use strict";
}
ContactOrganization.prototype.pref = false;
ContactOrganization.prototype.type = "";
ContactOrganization.prototype.name = "";
ContactOrganization.prototype.department = "";
ContactOrganization.prototype.title = "";

/**
 * Constructor for ContactOrganization with type checks. Implements W3C
 * ContactOrganization as in
 * http://dev.webinos.org/specifications/draft/contacts.html
 */
function ContactOrganization(_name, _type, _pref, _title, _department)
{
  "use strict";
  this.pref = _pref ? Boolean(_pref) : "";
  this.type = _type ? _type.substr(('http://schemas.google.com/g/2005#').length) : "";
  this.name = _name ? _name : "";
  this.department = _department ? _department : "";
  this.title = _title ? _title : "";
}

//ContactOrganization.prototype.toString = function()
//{
//  if (!this.isEmpty())
//    return (this.type == "" ? "other" : this.type) + ": " + this.name + (this.pref ? " *" : "") + "";
//  else
//    return "";
//};

ContactOrganization.prototype.isEmpty = function()
{
	"use strict";
  return (this.name === "");
};

/**
 * Empty Constructor for Contact Implements W3C Contact as in
 * http://dev.webinos.org/specifications/draft/contacts.html
 */
function Contact()
{
	"use strict";
}

Contact.prototype.id = "";
Contact.prototype.displayName = "";
Contact.prototype.name = new ContactName();
Contact.prototype.nickname = "";
Contact.prototype.phoneNumbers = [];
Contact.prototype.emails = [];
Contact.prototype.addresses = [];
Contact.prototype.ims = [];
Contact.prototype.organizations = [];
Contact.prototype.revision = "";
Contact.prototype.birthday = "";
Contact.prototype.gender = "";
Contact.prototype.note = "";
Contact.prototype.photos = [];
Contact.prototype.categories = [];
Contact.prototype.urls = [];
Contact.prototype.timezone = "";

/**
 * Constructor for Contact with type checks Implements W3C Contact as in
 * http://dev.webinos.org/specifications/draft/contacts.html
 */
function Contact(_id, _displayName, _name, _nickname, _phonenumbers, _emails, _addrs, _ims, _orgs, _rev, _birthday,
  _gender, _note, _photos, _categories, _urls, _timezone)
{
 "use strict";
  this.id = _id ? _id : "";
  this.displayName = _displayName ? _displayName : "";
  this.name = _name && _name instanceof ContactName ? _name : "";
  this.nickname = _nickname ? _nickname : "";
  this.phonenumbers = _phonenumbers && _phonenumbers instanceof Array && (_phonenumbers.length > 0 && (_phonenumbers[0] instanceof ContactField)) ? _phonenumbers : "";
  this.emails = _emails && _emails instanceof Array && (_emails.length > 0 && (_emails[0] instanceof ContactField)) ? _emails : "";
  this.addresses = _addrs && _addrs instanceof Array && (_addrs.length > 0 && (_addrs[0] instanceof ContactAddress)) ? _addrs : "";
  this.ims = _ims && _ims instanceof Array && (_ims.length > 0 && (_ims[0] instanceof ContactField)) ? _ims : "";
  this.organizations = _orgs && _orgs instanceof Array && (_orgs.length > 0 && (_orgs[0] instanceof ContactOrganization)) ? _orgs : "";
  this.revision = _rev && _rev instanceof Date ? _rev : "";
  this.birthday = _birthday && _birthday instanceof Date ? _birthday : "";
  this.gender = _gender ? _gender : "";
  this.note = _note ? _note : "";
  this.photos = _photos && _photos instanceof Array ? _photos : "";
  this.categories = _categories && _categories instanceof Array && (_categories.length > 0 && (_categories[0] instanceof String)) ? _categories : "";
  this.urls = _urls ? _urls : "";
  this.timezone = _timezone ? _timezone : "";
}


//Export classes
this.Contact=Contact;
this.ContactField=ContactField;
this.ContactName=ContactName;
this.ContactAddress=ContactAddress;
this.ContactOrganization=ContactOrganization;
