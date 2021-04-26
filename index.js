var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.movementActions = [
		{ id: 'Left',		label: 'Left' },
		{ id: 'Right',		label: 'Right' },
		{ id: 'Up',			label: 'Up' },
		{ id: 'Down',		label: 'Down' },
		{ id: 'UpLeft',		label: 'Up Left' },
		{ id: 'UpRight',	label: 'Up Right' },
		{ id: 'DownLeft',	label: 'Down Left' },
		{ id: 'DownRight',	label: 'Down Right' },
		{ id: 'Stop',		label: 'Stop' },
		{ id: 'ZoomIn',		label: 'Zoom In' },
		{ id: 'ZoomOut',	label: 'Zoom Out' },
		{ id: 'ZoomStop',	label: 'Zoom Stop' },
		{ id: 'FocusAuto',	label: 'Focus Auto' },
		{ id: 'FocusNear',	label: 'Focus Near' },
		{ id: 'FocusFar',	label: 'Focus Far' },
		{ id: 'Home',		label: 'Home' },
	]
	
	self.portActions = [
		{ id: 'PortUp',		label: 'Port Up' },
		{ id: 'PortDown',	label: 'Port Down' },
		{ id: 'Port1',		label: 'Port 1' },
		{ id: 'Port2',		label: 'Port 2' },
		{ id: 'Port3',		label: 'Port 3' },
		{ id: 'Port4',		label: 'Port 4' },
		{ id: 'Port5',		label: 'Port 5' },
	]
	
	self.cameraActions = [
		{ id: 'CamNumUp',	label: 'Camera Number Up' },
		{ id: 'CamNumDown',	label: 'Camera Number Down' },
		{ id: 'Camera1',	label: 'Camera 1' },
		{ id: 'Camera2',	label: 'Camera 2' },
		{ id: 'Camera3',	label: 'Camera 3' },
		{ id: 'Camera4',	label: 'Camera 4' },
		{ id: 'Camera5',	label: 'Camera 5' },
		{ id: 'Camera6',	label: 'Camera 6' },
		{ id: 'Camera7',	label: 'Camera 7' },
		{ id: 'Camera8',	label: 'Camera 8' },
	]
	
	self.presetActions = [
		{ id: 'IntPresets',	label: 'Use Internal Presets' },
		{ id: 'ExtPresets',	label: 'Use External Presets' },
		{ id: 'SetPreset',	label: 'Save Current Preset' },
	]

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;

	self.actions();
}

instance.prototype.init = function() {
	var self = this;

	self.status(self.STATE_OK);

	debug = self.debug;
	log = self.log;
	
	// export actions
	self.actions(); 
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module will allow you to use Companion with the Rocosoft PTZJoy controller.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Controller IP Address',
			width: 6,
			regex: self.REGEX_IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Controller Port',
			width: 6,
			default: '80',
			regex: self.REGEX_PORT,
		},
	]
}

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destroy");
}

// Create actions
instance.prototype.actions = function(system) {
	var self = this;

	self.setActions({
		'movement': {
			label: 'Basic Movement',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'moveAction',
					default: 'Home',
					choices: self.movementActions,
				},
			],
		},
		'portManagement': {
			label: 'Port Management',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'portAction',
					default: 'Port1',
					choices: self.portActions,
				},
			],
		},
		'cameraManagement': {
			label: 'Camera Management',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'cameraAction',
					default: 'Camera1',
					choices: self.cameraActions,
				},
			],
		},
		'presetManagement': {
			label: 'Preset Management',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'presetAction',
					default: 'SetPreset',
					choices: self.presetActions,
				},
			],
		},
		'getPreset': {
			label: 'Load Preset',
			options: [
				{
					type: 'number',
					label: 'Preset Number',
					id: 'presetNumber',
					min: 1,
					max: 32,
					default: 1,
				}
			]
		},
		'setPreset': {
			label: 'Save Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Type',
					id: 'setPresetType',
					default: 'Int',
					choices: [
						{ id: 'Int', label: 'Internal' },
						{ id: 'Ext', label: 'External' },
					]
				},
				{
					type: 'number',
					label: 'Preset Number',
					id: 'presetNumber',
					min: 1,
					max: 32,
					default: 1,
				},
			],
		},
		'getMacro': {
			label: 'Run Macro',
			options: [
				{
					type: 'number',
					label: 'Macro Number',
					id: 'presetNumber',
					min: 1,
					max: 16,
					default: 1,
				}
			]
		},
	});
}

// Process actions
instance.prototype.action = function (action) {
	var self = this
	const opt = action.options
	
	switch(action.action) {
		case 'movement': {
			self.sendGet(opt.moveAction)
			break;
		}
		case 'portManagement': {
			self.sendGet(opt.portAction)
			break;
		}
		case 'cameraManagement': {
			self.sendGet(opt.cameraAction)
			break;
		}
		case 'presetManagement': {
			self.sendGet(opt.presetAction)
			break;
		}
		case 'getPreset': {
			self.sendGet('Preset' + String(opt.presetNumber))
			break;
		}
		case 'setPreset': {
			self.sendGet('Set' + opt.setPresetType + 'Preset=' + String(opt.presetNumber))
			break;
		}
		case 'getMacro': {
			self.sendGet('RunMacro' + String(opt.presetNumber))
			break;
		}
	}
	
	
}	

// send command to PTZJoy websocket
instance.prototype.sendGet = function(cmd) {
	var self = this;

	cmdUrl = 'http://' + self.config.host + ':' + self.config.port + '/PTZJoy=' + cmd
	self.log('debug',cmdUrl)
	console.log(cmdUrl)
	
	self.system.emit('rest_get', cmdUrl, function (err, result) {
		if (err !== null) {
			// PTZJoy software is not fully compatible with rest_get and returns errors
			// self.log('error', 'HTTP GET Request failed (' + result.error.code + ')');
			// self.status(self.STATUS_ERROR, result.error.code);
		} else {
			// self.status(self.STATUS_OK);
		}
	});
	
	/*
	if (action.action == 'get') {
		var header;
		if(!!action.options.header) {
			try {
				header = JSON.parse(action.options.header);
			} catch(e){
				self.log('error', 'HTTP POST Request aborted: Malformed JSON header (' + e.message+ ')');
				self.status(self.STATUS_ERROR, e.message);
				return
			}
			self.system.emit('rest_get', cmd, function (err, result) {
				if (err !== null) {
					self.log('error', 'HTTP GET Request failed (' + result.error.code + ')');
					self.status(self.STATUS_ERROR, result.error.code);
				}
				else {
					self.status(self.STATUS_OK);
				}
			}, header);
		} else {
			self.system.emit('rest_get', cmd, function (err, result) {
				if (err !== null) {
					self.log('error', 'HTTP GET Request failed (' + result.error.code + ')');
					self.status(self.STATUS_ERROR, result.error.code);
				}
				else {
					self.status(self.STATUS_OK);
				}
			});
		}
	}
	*/

}

instance_skel.extendedBy(instance);
exports = module.exports = instance;
