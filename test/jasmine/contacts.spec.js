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
var contactsService;

console.log(webinos.global);

    webinos.discovery.findServices(new ServiceType("http://www.w3.org/ns/api-perms/contacts"), {
		onFound: function (unboundService) {
			unboundService.bindService({onBind: function(service) {
				contactsService = service;
			}});
		}
	});

var param = [];
param[0] = {};

var timeout = 1000;


describe("test contacts_module", function() {
     
    beforeEach(function() {
        waitsFor(function() {
            return !!contactsService;
        }, "finding a contacts service", 5000);
    });
    
    
    it("could be found and be bound", function() {
        expect(contactsService).toBeDefined();
    });
    
    
    it("has the necessary properties as service object", function() {
        expect(contactsService.state).toBeDefined();
        expect(contactsService.api).toEqual(jasmine.any(String));
        expect(contactsService.id).toEqual(jasmine.any(String));
        expect(contactsService.displayName).toEqual(jasmine.any(String));
        expect(contactsService.description).toEqual(jasmine.any(String));
        expect(contactsService.icon).toEqual(jasmine.any(String));
        expect(contactsService.bindService).toEqual(jasmine.any(Function));
    });
    
    it("has the necessary properties and functions as Contacts API service", function() {
        expect(contactsService.find).toEqual(jasmine.any(Function));
    });

    
    
    it("retrive contacts list", function() {
        var parameters = {};
        var results = false;
        if (contactsService)
        {
            parameters.fields = {};
            contactsService.find(parameters.fields, function(list){
                results = list;
            });
            
            waitsFor(function() {
            return results;
            }, "success callback has been called", 2000);
            
            runs(function() {
                contacts = results;
                expect(results).toBeDefined();
            }); 
        }
    });
      
      
    it("check if returned contact fields are W3C compliant", function() {	
        
        var parameters = {};
        var results = false;
        
        if (contactsService)
        {
            parameters.fields = {};
            contactsService.find(parameters.fields, function(list){
                results = list;
            });
            
            waitsFor(function() {
            return results;
            }, "success callback has been called", 2000);
            
            runs(function() {
                contacts = results;
               
                expect(contacts).not.toBeNull();
                
                console.log("\n\n\n");
                console.log(contacts);
                
                if(contacts !== undefined){
                    for(var i=0;i<contacts.length;i++){
                        expect(contacts[i].id).not.toBeUndefined();
                        expect(contacts[i].displayName).not.toBeUndefined();
                        expect(contacts[i].name).not.toBeUndefined();
                        expect(contacts[i].nickname).not.toBeUndefined();
                        //~ expect(contacts[i].phoneNumbers).not.toBeUndefined();
                        expect(contacts[i].emails).not.toBeUndefined();
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
        }
    }); 
});

    



