let Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    this.dependency = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Would you like to enable the Cool feature?"
      }
    ]);
  }

  writing() {
    const pkgJson = {
      devDependencies: {
        [this.dependency.name]: '*'
      },
    };
    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.npmInstall();
  }

 
};