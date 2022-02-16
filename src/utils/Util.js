const moment = require("moment");
const { appendFileSync, existsSync, mkdirSync } = require("fs");

module.exports = class Util {
  static logger(toLog) {
    const data = moment(Date.now()).format("D/MM/YYYY | HH:mm:SS");

    const dataname = moment(Date.now()).format("DMMYYYY");

    if (!existsSync(`./logs`)) mkdirSync(`./logs`);
    appendFileSync(`./logs/${dataname}.txt`, `[${data}] ${toLog}\n`);
    return;
  }

  static formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes'
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		const i = Math.floor(Math.log(bytes) / Math.log(1024))
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
	}

  static roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}

};
