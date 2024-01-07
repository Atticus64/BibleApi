interface Logger {
	color: string;
	name: string;
}

export interface Loggers {
	info: Logger;
	error: Logger;
}

export const loggers = {
	info: {
		color: "#82E0AA",
		name: "INFO",
	},
	error: {
		color: "#F93610",
		name: "ERROR",
	},
};

const getColor = (key: string) => {
	const logger: Logger = loggers[key as keyof Loggers];

	return logger;
};

export const log = (message: string, type: keyof Loggers) => {
	const logger = getColor(type);

	console.log(
		`%c[${logger.name}] %c${message}`,
		`color: ${logger.color}`,
		"color: #ffffff",
	);
};
