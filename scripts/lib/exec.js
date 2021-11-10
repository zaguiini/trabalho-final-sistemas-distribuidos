const exec = async (command) => new Promise((resolve, reject) => {
  require('child_process').exec(command, (err, out) => {
    if(err) {
      return reject(err)
    }

    resolve(out.toString().trim())
  })
})

module.exports = exec
