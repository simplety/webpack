const path = require('path')
const fs = require('fs') // 文件系统工具

let svgFolder = path.join(__dirname, '../static/svg_icons')
let jsPath = path.join(__dirname, '../src/assets/icons.js')

if (fs.existsSync(svgFolder)) {
  let svgFiles = fs.readdirSync(svgFolder)
  if (svgFiles.length > 0) {
    let symbols = svgFiles.map(filename => {
      let absolutePath = path.join(svgFolder, filename)
      let fileContent = fs.readFileSync(absolutePath).toString('utf-8')
      let name = path.basename(filename, '.svg')
      return fileContent
        .replace(/<\?.+?\?>/g, '') // 去掉 <?xml version="1.0" standalone="no"?>
        .replace(/<!.+?>/g, '') // 去掉 <!DOCTYPE svg PUBLIC ...>
        .replace(/version=".+?"/g, '')
        .replace(/xmlns=".+?"/g, '')
        .replace(/class=".+?"/g, '')
        .replace(/fill=".+?"/g, '')
        .replace(/stroke=".+?"/g, '')
        .replace(/<svg /, `<svg id="icon-${name}" `)
        .replace(/\bsvg\b/g, 'symbol') // 改 svg 为 symbol
        .replace(/\s{2,}/g, ' ')
    }).join('\n')
    let js = `export default \`<svg style="display:none">\n${symbols}\n</svg>\`\n`
    fs.writeFileSync(jsPath, js, {flag: 'w'})
  } else {
    console.log('not svg files found in source folder.')
  }
} else {
  console.log('Cannot find the source folder')
}
