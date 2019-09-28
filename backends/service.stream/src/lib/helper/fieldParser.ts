export const fieldsParser = (obj) => {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            if (obj[key] === 'true')
                obj[key] = true;
            else if (obj[key] === 'false')
                obj[key] = false;
            else {
                // Check if key is array by finding "s" in the end, 
                // exp: columns: "1" => colums: [1], not columns: 1
                if (key[key.length - 1] === 's') {
                    obj[key] = obj[key].toString().split(',');
                    fieldsParser(obj[key]);
                }
                else {
                    let number = Number(obj[key]);
                    if (number || number === 0)
                        obj[key] = number;
                }
            }
        }
        else if (typeof obj[key] === 'object') {
            fieldsParser(obj[key]);
        }
    }
}