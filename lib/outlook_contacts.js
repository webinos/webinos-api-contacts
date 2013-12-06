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

var getOutlookContacts = function(){
  var win32ole = require('win32ole');
  var olFolderContacts = 10;
  var fields = new Array("Account","Actions","Anniversary","Application","AssistantName","AssistantTelephoneNumber","Attachments","AutoResolvedWinner","BillingInformation","Birthday","Body","Business2TelephoneNumber","BusinessAddress","BusinessAddressCity","BusinessAddressCountry","BusinessAddressPostalCode","BusinessAddressPostOfficeBox","BusinessAddressState","BusinessAddressStreet","BusinessCardLayoutXml","BusinessCardType","BusinessFaxNumber","BusinessHomePage","BusinessTelephoneNumber","CallbackTelephoneNumber","CarTelephoneNumber","Categories","Children","Class","Companies","CompanyAndFullName","CompanyLastFirstNoSpace","CompanyLastFirstSpaceOnly","CompanyMainTelephoneNumber","CompanyName","ComputerNetworkName","Conflicts","ConversationIndex","ConversationTopic","CreationTime","CustomerID","Department","DownloadState","Email1Address","Email1AddressType","Email1DisplayName","Email1EntryID","Email2Address","Email2AddressType","Email2DisplayName","Email2EntryID","Email3Address","Email3AddressType","Email3DisplayName","Email3EntryID","EntryID","FileAs","FirstName","FormDescription","FTPSite","FullName","FullNameAndCompany","Gender","GetInspector","GovernmentIDNumber","HasPicture","Hobby","Home2TelephoneNumber","HomeAddress","HomeAddressCity","HomeAddressCountry","HomeAddressPostalCode","HomeAddressPostOfficeBox","HomeAddressState","HomeAddressStreet","HomeFaxNumber","HomeTelephoneNumber","IMAddress","Importance","Initials","InternetFreeBusyAddress","IsConflict","ISDNNumber","IsMarkedAsTask","ItemProperties","JobTitle","Journal","Language","LastFirstAndSuffix","LastFirstNoSpace","LastFirstNoSpaceAndSuffix","LastFirstNoSpaceCompany","LastFirstSpaceOnly","LastFirstSpaceOnlyCompany","LastModificationTime","LastName","LastNameAndFirstName","Links","MailingAddress","MailingAddressCity","MailingAddressCountry","MailingAddressPostalCode","MailingAddressPostOfficeBox","MailingAddressState","MailingAddressStreet","ManagerName","MAPIOBJECT","MarkForDownload","MessageClass","MiddleName","Mileage","MobileTelephoneNumber","NetMeetingAlias","NetMeetingServer","NickName","NoAging","OfficeLocation","OrganizationalIDNumber","OtherAddress","OtherAddressCity","OtherAddressCountry","OtherAddressPostalCode","OtherAddressPostOfficeBox","OtherAddressState","OtherAddressStreet","OtherFaxNumber","OtherTelephoneNumber","OutlookInternalVersion","OutlookVersion","PagerNumber","Parent","PersonalHomePage","PrimaryTelephoneNumber","Profession","PropertyAccessor","RadioTelephoneNumber","ReferredBy","ReminderOverrideDefault","ReminderPlaySound","ReminderSet","ReminderSoundFile","ReminderTime","Saved","SelectedMailingAddress","Sensitivity","Session","Size","Spouse","Subject","Suffix","TaskCompletedDate","TaskDueDate","TaskStartDate","TaskSubject","TelexNumber","Title","ToDoTaskOrdinal","TTYTDDTelephoneNumber","UnRead","User1","User2","User3","User4","UserCertificate","UserProperties","WebPage","YomiCompanyName","YomiFirstName","YomiLastName");

  var ol = win32ole.client.Dispatch('Outlook.Application');
  var ns = ol.GetNameSpace('MAPI');
  var frcv = ns.GetDefaultFolder(olFolderContacts);
  
  var items = frcv.Items._;
  var count = items.Count;

  var counter = [85, 55, 60, 57, 95, 109, 114, 23, 33, 78, 111, 126, 132, 43, 45, 46, 47, 49, 50, 51, 53, 54, 68, 69, 70, 71, 72, 73, 74, 98, 99, 100, 101, 102, 103, 104, 118, 119, 120, 121, 122, 123, 124, 12, 13, 14, 15, 16, 17, 18, 77, 30, 31, 32, 33, 34, 65, 26, 165, 131];
  //var wannabeCounter =[94, 9, 62, 58];

  var outlookContacts = [];      
  for(var n=1;n<=count;++n){
	var outlookContact = {};
	for(var j in counter)
		outlookContact[fields[counter[j]]] = items.Item(n)[fields[counter[j]]];
	outlookContacts.push(outlookContact);	
  }  
    
  return outlookContacts;
}

exports.getOutlookContacts = getOutlookContacts();
