/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { homedir } from "os";
import { dirname, resolve } from "path";
import { name } from "../package.json";

type ConfigType = {
	checkIntervalSeconds: number,
	notificationDurationSeconds: number,
	aurHelperBinary: string,
	sudoBinary: string,
	pacmanBinary: string,
	terminalBinary: string,
	Syy: boolean,
	updateDatabase: boolean
}

const defaultConfig: ConfigType = {
	checkIntervalSeconds: 60 * 60,
	notificationDurationSeconds: 10,
	aurHelperBinary: "/usr/bin/yay",
	sudoBinary: "/usr/bin/sudo",
	pacmanBinary: "/usr/bin/pacman",
	terminalBinary: "/usr/bin/xterm",
	Syy: false,
	updateDatabase: false
};

export default class Config implements ConfigType {

	private _instance?: Config;
	private config: ConfigType;

	private constructor(){
		const configPath = resolve(homedir(), ".config", name, "config.json");
		try {
			mkdirSync(dirname(configPath), { recursive: true });
		} catch (_){
			// dir exists
		} 

		try {
			this.config = Object.assign({}, defaultConfig, JSON.parse(readFileSync(configPath, "utf-8")));
		} catch (_) { // config does not exist
			this.config = defaultConfig;
		}

		// Always re-save the config
		writeFileSync(configPath, JSON.stringify(this.config, undefined, 2));

		Config.prototype._instance = this;
	}

	public static getInstance(): Config{
		if(typeof Config.prototype._instance === "undefined")
			new Config();
		
		return Config.prototype._instance as Config;
	}

	public get checkIntervalSeconds(): number{
		return this.config.checkIntervalSeconds;
	}

	public get notificationDurationSeconds(): number{
		return this.config.notificationDurationSeconds;
	}

	public get aurHelperBinary(): string {
		return this.config.aurHelperBinary;
	}

	public get sudoBinary(): string {
		return this.config.sudoBinary;
	}

	public get pacmanBinary(): string {
		return this.config.pacmanBinary;
	}

	public get terminalBinary(): string {
		return this.config.terminalBinary;
	}

	public get Syy(): boolean {
		return this.config.Syy;
	}

	public get updateDatabase(): boolean {
		return this.config.updateDatabase;
	}
}