var instance_skel = require('../../instance_skel')
var debug
var log

function instance(system, id, config) {
	var self = this

	// super-constructor
	instance_skel.apply(this, arguments)

	self.movementActions = [
		{ id: 'Left', label: 'Left' },
		{ id: 'Right', label: 'Right' },
		{ id: 'Up', label: 'Up' },
		{ id: 'Down', label: 'Down' },
		{ id: 'UpLeft', label: 'Up Left' },
		{ id: 'UpRight', label: 'Up Right' },
		{ id: 'DownLeft', label: 'Down Left' },
		{ id: 'DownRight', label: 'Down Right' },
		{ id: 'Stop', label: 'Stop' },
		{ id: 'ZoomIn', label: 'Zoom In' },
		{ id: 'ZoomOut', label: 'Zoom Out' },
		{ id: 'ZoomStop', label: 'Zoom Stop' },
		{ id: 'FocusAuto', label: 'Focus Auto' },
		{ id: 'FocusNear', label: 'Focus Near' },
		{ id: 'FocusFar', label: 'Focus Far' },
		{ id: 'Home', label: 'Home' },
	]

	self.portActions = [
		{ id: 'PortUp', label: 'Port Up' },
		{ id: 'PortDown', label: 'Port Down' },
		{ id: 'Port1', label: 'Port 1' },
		{ id: 'Port2', label: 'Port 2' },
		{ id: 'Port3', label: 'Port 3' },
		{ id: 'Port4', label: 'Port 4' },
		{ id: 'Port5', label: 'Port 5' },
	]

	self.cameraActions = [
		{ id: 'CamNumUp', label: 'Camera Number Up' },
		{ id: 'CamNumDown', label: 'Camera Number Down' },
		{ id: 'Camera1', label: 'Camera 1' },
		{ id: 'Camera2', label: 'Camera 2' },
		{ id: 'Camera3', label: 'Camera 3' },
		{ id: 'Camera4', label: 'Camera 4' },
		{ id: 'Camera5', label: 'Camera 5' },
		{ id: 'Camera6', label: 'Camera 6' },
		{ id: 'Camera7', label: 'Camera 7' },
		{ id: 'Camera8', label: 'Camera 8' },
	]

	self.presetActions = [
		{ id: 'IntPresets', label: 'Use Internal Presets' },
		{ id: 'ExtPresets', label: 'Use External Presets' },
		{ id: 'SetPreset', label: 'Save Current Preset' },
	]
	
	self.utilActions = [
		{ id: 'XJoyOn', label: 'Pan Only On (Disable Tilt Up/Down)' },
		{ id: 'XJoyOff', label: 'Pan Only Off (Enable Tilt Up/Down)' },
		{ id: 'SlowJoy1', label: 'Slow/Stretch 1' },
		{ id: 'SlowJoy2', label: 'Slow/Stretch 2' },
		{ id: 'SlowJoy3', label: 'Slow/Stretch 3' },
		{ id: 'SlowJoyOff', label: 'Slow/Stretch Off' },
	//	{ id: 'SoftJoyOn', label: 'Soft Joy On' },
	//	{ id: 'SoftJoyOff', label: 'Soft Joy Off' },
	]

	return self
}

instance.prototype.updateConfig = function (config) {
	var self = this

	self.config = config

	self.actions()
}

instance.prototype.init = function () {
	var self = this

	self.status(self.STATE_OK)

	debug = self.debug
	log = self.log

	self.init_presets()

	// export actions
	self.actions()
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module will allow you to use Companion with the Rocosoft PTZJoy software camera controller.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'PTZJoy IP Address',
			width: 6,
			regex: self.REGEX_IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'PTZJoy Port',
			width: 6,
			default: '80',
			regex: self.REGEX_PORT,
		},
		{
			type: 'checkbox',
			id: 'debuglog',
			label: 'Show command URL in debug log',
			width: 6,
			default: false,
		},
	]
}

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this
	debug('destroy')
}

instance.prototype.presets = function () {
	var self = this
	self.setPresetDefinitions(presets.getPresets(self.label))
}

instance.prototype.init_presets = function () {
	var self = this
	var presets = []
	var i

	for (i = 0; i < self.movementActions.length; ++i) {
		presets.push({
			category: 'Basic Movement',
			label: self.movementActions[i].label,
			bank: {
				style: 'text',
				text: self.movementActions[i].label,
				size: '18',
				color: 16777215,
				bgcolor: 0,
			},
			actions: [
				{
					action: 'movement',
					options: {
						moveAction: self.movementActions[i].id,
					},
				},
			],
		})
	}

	for (i = 0; i < self.portActions.length; ++i) {
		presets.push({
			category: 'Port Management',
			label: self.portActions[i].label,
			bank: {
				style: 'text',
				text: self.portActions[i].label,
				size: '18',
				color: 16777215,
				bgcolor: 0,
			},
			actions: [
				{
					action: 'portManagement',
					options: {
						portAction: self.portActions[i].id,
					},
				},
			],
		})
	}

	for (i = 0; i < self.cameraActions.length; ++i) {
		presets.push({
			category: 'Camera Management',
			label: self.cameraActions[i].label,
			bank: {
				style: 'text',
				text: self.cameraActions[i].label,
				size: '14',
				color: 16777215,
				bgcolor: 0,
			},
			actions: [
				{
					action: 'cameraManagement',
					options: {
						cameraAction: self.cameraActions[i].id,
					},
				},
			],
		})
	}

	for (i = 0; i < self.presetActions.length; ++i) {
		presets.push({
			category: 'Preset Management',
			label: self.cameraActions[i].label,
			bank: {
				style: 'text',
				text: self.presetActions[i].label,
				size: '18',
				color: 16777215,
				bgcolor: 0,
			},
			actions: [
				{
					action: 'presetManagement',
					options: {
						presetAction: self.presetActions[i].id,
					},
				},
			],
		})
	}

	for (i = 1; i < 33; i++) {
		presets.push({
			category: 'Load Preset',
			label: 'Preset ' + String(i),
			bank: {
				style: 'text',
				text: 'Preset\\n' + String(i),
				size: '18',
				color: 16777215,
				bgcolor: 0,
			},
			actions: [
				{
					action: 'getPreset',
					options: {
						presetNumber: i,
					},
				},
			],
		})
	}

	for (i = 1; i < 17; i++) {
		presets.push({
			category: 'Run Macro',
			label: 'Macro ' + String(i),
			bank: {
				style: 'text',
				text: 'Macro\\n' + String(i),
				size: '18',
				color: 16777215,
				bgcolor: 0,
			},
			actions: [
				{
					action: 'getMacro',
					options: {
						presetNumber: i,
					},
				},
			],
		})
	}

	presets.push({
		category: 'Tally',
		label: 'Tally On',
		bank: {
			style: 'text',
			text: 'Tally\\nOn',
			size: '18',
			color: 16777215,
			bgcolor: 0,
		},
		actions: [
			{
				action: 'tally',
				options: {
					tally: 'TallyOn',
				},
			},
		],
	})

	presets.push({
		category: 'Tally',
		label: 'Tally Off',
		bank: {
			style: 'text',
			text: 'Tally\\nOff',
			size: '18',
			color: 16777215,
			bgcolor: 0,
		},
		actions: [
			{
				action: 'tally',
				options: {
					tally: 'TallyOff',
				},
			},
		],
	})

	presets.push({
		category: 'Camera Power',
		label: 'Power On',
		bank: {
			style: 'text',
			text: 'Power\\nOn',
			size: '18',
			color: 16777215,
			bgcolor: 0,
		},
		actions: [
			{
				action: 'power',
				options: {
					power: 'CamOn',
				},
			},
		],
	})

	presets.push({
		category: 'Camera Power',
		label: 'Power Off',
		bank: {
			style: 'text',
			text: 'Power\\nOff',
			size: '18',
			color: 16777215,
			bgcolor: 0,
		},
		actions: [
			{
				action: 'power',
				options: {
					power: 'CamOff',
				},
			},
		],
	})

	self.setPresetDefinitions(presets)
}

// Create actions
instance.prototype.actions = function (system) {
	var self = this

	self.setActions({
		movement: {
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
		portManagement: {
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
		cameraManagement: {
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
		presetManagement: {
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
		getPreset: {
			label: 'Load Preset',
			options: [
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
		setPreset: {
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
					],
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
		getMacro: {
			label: 'Run Macro',
			options: [
				{
					type: 'number',
					label: 'Macro Number',
					id: 'presetNumber',
					min: 1,
					max: 16,
					default: 1,
				},
			],
		},
		tally: {
			label: 'Tally',
			options: [
				{
					type: 'dropdown',
					label: 'Tally',
					id: 'tally',
					default: 'TallyOn',
					choices: [
						{ id: 'TallyOn', label: 'On' },
						{ id: 'TallyOff', label: 'Off' },
					],
				},
			],
		},
		power: {
			label: 'Camera Power',
			options: [
				{
					type: 'dropdown',
					label: 'Power',
					id: 'power',
					default: 'CamOn',
					choices: [
						{ id: 'CamOn', label: 'On' },
						{ id: 'CamOff', label: 'Off' },
					],
				},
			],
		},
		utils: {
			label: 'Other Functions',
			options: [
				{
					type: 'dropdown',
					label: 'Slow Mode',
					id: 'utils',
					default: 'XJoyOn',
					choices: self.utilActions,
				},
			],
		},
	})
}

// Process actions
instance.prototype.action = function (action) {
	var self = this
	const opt = action.options

	switch (action.action) {
		case 'movement': {
			self.sendGet(opt.moveAction)
			break
		}
		case 'portManagement': {
			self.sendGet(opt.portAction)
			break
		}
		case 'cameraManagement': {
			self.sendGet(opt.cameraAction)
			break
		}
		case 'presetManagement': {
			self.sendGet(opt.presetAction)
			break
		}
		case 'getPreset': {
			self.sendGet('Preset' + String(opt.presetNumber))
			break
		}
		case 'setPreset': {
			self.sendGet('Set' + opt.setPresetType + 'Preset=' + String(opt.presetNumber))
			break
		}
		case 'getMacro': {
			self.sendGet('RunMacro' + String(opt.presetNumber))
			break
		}
		case 'tally': {
			self.sendGet(opt.tally)
			break
		}
		case 'power': {
			self.sendGet(opt.power)
			break
		}
		case 'utils': {
			self.sendGet(opt.utils)
			break
		}
	}
}

// send command to PTZJoy
instance.prototype.sendGet = function (cmd) {
	var self = this

	cmdUrl = 'http://' + self.config.host + ':' + self.config.port + '/PTZJoy=' + cmd

	if (self.config.debuglog === true) {
		self.log('debug', cmdUrl)
	}

	console.log(cmdUrl)

	self.system.emit('rest_get', cmdUrl, function (err, result) {
		if (err !== null) {
			if (result.error.code == 'HPE_INVALID_CONSTANT') {
				// PTZJoy software is not fully compatible with rest_get and returns this error always
				self.status(self.STATUS_OK)
			} else {
				self.log('error', 'HTTP GET Request failed (' + result.error.code + ')')
				self.status(self.STATUS_ERROR, result.error.code)
			}
		} else {
			self.status(self.STATUS_OK)
		}
	})
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
