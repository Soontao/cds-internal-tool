const fs = require("fs")

const p = JSON.parse(fs.readFileSync("./package.json"))
const { devDependencies, ...others } = p
fs.writeFileSync('./package.json', JSON.stringify(others, undefined, 2)) 
