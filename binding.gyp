{
  'variables': {
    'module_name': 'localcontacts',#Specify the module name here
  },
  'targets': [
    {
	  # Needed declarations for the target
	  'target_name': '<(module_name)',
	  'product_name':'<(module_name)',
	  'sources': [ #Specify your source files here
			'src/thunderbird_AB_parser/MorkAddressBook.cpp',
			'contrib/MorkParser.cpp',
			'src/thunderbird_AB_parser/node_contacts_mork.cpp',
		],
		'include_dirs': [
		   'contrib',
		],
		'conditions': [
			[ 'OS=="win"', {
				'defines': [
					# We need to use node's preferred "win32" rather than gyp's preferred "win"
					'uint=unsigned int',
				],
			 },
			],
		],
    },
    {
      'target_name': 'webinos_wrt',
      'type': 'none',
      'toolsets': ['host'],
      'copies': [
        {
        'files': [
          'build/Release/localcontacts.node',
        ],
        'destination': 'node_modules/',
        }],
    }, # end webinos_wrt
  ] # end targets
}

