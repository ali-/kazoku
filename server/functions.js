function empty(input) {
	return (input == "" || input == null) ? true : false;
}

function parse_date(string) {
	var b = string.split(/\D/);
	return new Date(b[0],b[1]-1,b[2],b[3],b[4],b[5]);
}


module.exports = { empty, parse_date };
