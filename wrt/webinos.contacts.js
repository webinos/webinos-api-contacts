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

(function(){   
    Contacts = function(obj) {
        WebinosService.call(this, obj);
    };  
	// Inherit all functions from WebinosService
	Contacts.prototype = Object.create(WebinosService.prototype);	
	// The following allows the 'instanceof' to work properly
	Contacts.prototype.constructor = Contacts;
	// Register to the service discovery
    _webinos.registerServiceConstructor("http://webinos.org/api/contacts", Contacts); 
    // If you want to support the depricated uri, uncomment the following line
    //_webinos.registerServiceConstructor("http://www.w3.org/ns/api-perms/contacts", Contacts);        

    Contacts.prototype.bindService = function (bindCB, serviceId) {
        this.syncOutlookContacts = syncOutlookContacts;
        this.syncThunderbirdContacts = syncThunderbirdContacts;
	    this.syncGoogleContacts = syncGoogleContacts;
	    this.find = find;

	    if (typeof bindCB.onBind === 'function') {
		    bindCB.onBind(this);
	    };
    }
    
    /**
     * sync Outlook contacts with local cache on win32 systems ONLY
     * */
    function syncOutlookContacts(attr, successCB,errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "syncOutlookContacts", [ attr ]);
        
        webinos.rpcHandler.executeRPC(rpc, function(params){
            successCB(params);
        }, function(error){
            if (typeof(errorCB) !== 'undefined')
                errorCB(error);
        });
    };
    
    /**
     * sync thunderbird contacts with local cache
     * */
    function syncThunderbirdContacts(attr, successCB,errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "syncThunderbirdContacts", [ attr ]);

        webinos.rpcHandler.executeRPC(rpc, function(params){
            successCB(params);
        }, function(error){
            if (typeof(errorCB) !== 'undefined')
                errorCB(error);
        });
    };
   
    /**
    * returns true if contacts service is authenticated with GMail using username and password
    * or a valid address book file could be open
    * TODO this method has to be removed when user profile will handle this
    * */
    function syncGoogleContacts(attr, successCB,errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "syncGoogleContacts", [ attr ]);
        // function
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
                errorCB(error);
        });
    };
     

    /**
     * return a list of contacts matching some search criteria
     * 
     * TODO full W3C specs
     */
    function find(attr,successCB,errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "find", [ attr ]);
        //RPCservicename,
        // function
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        });
    };

}());
