/*******************************************************************************
*  Code contributed to the webinos project
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* Copyright 2011 ISMB
*******************************************************************************/


var webinos = require("find-dependencies")(__dirname);

console.log(webinos.global);


	//~ var RPCHandler = webinos.global.require(webinos.global.rpc.location).RPCHandler;
	//~ var service = webinos.global.require(webinos.global.api.events.location).Service;
	//~ var events = new service(RPCHandler);
	//~ beforeEach(function() {
		//~ this.addMatchers({
			//~ toBeFunction: function() {
				//~ return typeof this.actual === 'function';
			//~ },
			//~ toBeObject: function() {
				//~ return typeof this.actual === 'object';
			//~ },
			//~ toBeString: function() {
				//~ return typeof this.actual === 'string';
			//~ },
			//~ toBeNumber: function() {
				//~ return typeof this.actual === 'number';
			//~ }
		//~ });
	//~ });


var contactsModule = require("../../lib/contacts_modules.js");
var param = [];
param[0] = {};

var timeout = 1000;


describe("test contacts_module, local", function() {
  
    
    describe("check if retrieved contacts is formed as expected", function() {
      
        it("check if returned contact fields are W3C compliant", function() {       		 	
            contactsModule.findContacts(param, function(contacts){ 
                expect(contacts).not.toBeNull();	    
                
                if(contacts !== undefined){
                    for(var i=0;i<contacts.length;i++){
                    expect(contacts[i].id).not.toBeUndefined();
                    expect(contacts[i].displayName).not.toBeUndefined();
                    expect(contacts[i].name).not.toBeUndefined();
                    expect(contacts[i].nickname).not.toBeUndefined();
                    //~ expect(contacts[i].phoneNumbers).not.toBeUndefined();
                    //~ expect(contacts[i].emails).not.toBeUndefined();
                    //~ expect(contacts[i].addresses).not.toBeUndefined();
                    //~ expect(contacts[i].ims).not.toBeUndefined();
                    //~ expect(contacts[i].organizations).not.toBeUndefined();
                    //~ expect(contacts[i].revision).not.toBeUndefined();
                    //~ expect(contacts[i].birthday).not.toBeUndefined();
                    //~ expect(contacts[i].gender).not.toBeUndefined();
                    //~ expect(contacts[i].note).not.toBeUndefined();
                    //~ expect(contacts[i].photos).not.toBeUndefined();
                    //~ expect(contacts[i].categories).not.toBeUndefined();
                    //~ expect(contacts[i].urls).not.toBeUndefined();
                    //~ expect(contacts[i].timezone).not.toBeUndefined();						
                    }
                }	    
            });
        });      
    });                        
});

    



